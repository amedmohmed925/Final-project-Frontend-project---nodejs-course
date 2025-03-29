import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCourseById } from "../../api/courseApi";
import { getCourseProgress, updateCourseProgress } from "../../api/courseProgressApi";
import { FaChevronDown, FaPlayCircle, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaForward, FaBackward, FaExpand, FaCompress, FaCheck } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import ReactPlayer from "react-player";
import "../../styles/LessonPage.css";
import "../../styles/CourseProgress.css";
import Logo from "../Logo";
const LessonPage = () => {
  const { courseId, sectionIndex, lessonIndex } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(parseInt(sectionIndex));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState({ top: "10%", left: "10%" });
  const [videoProgress, setVideoProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        if (user) {
          const progressData = await getCourseProgress(courseId);
          setProgress(progressData.progress || { completionPercentage: 0, sections: [] });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndProgress();
  }, [courseId, user]);

  useEffect(() => {
    const moveWatermark = () => {
      const maxTop = 10;
      const maxLeft = 10;
      setWatermarkPosition({ top: maxTop, left: maxLeft });
    };

    const interval = setInterval(moveWatermark, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleFastForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setVideoProgress(newProgress);
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo((newProgress / 100) * duration);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen();
    }
  };

  const markLessonAsCompleted = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      const updatedProgress = await updateCourseProgress(courseId, {
        sectionIndex: parseInt(sectionIndex),
        lessonIndex: parseInt(lessonIndex),
        completed: true,
      });
      setProgress(updatedProgress.progress);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const isLessonCompleted = (sIndex, lIndex) => {
    if (!progress || !progress.sections) return false;
    const section = progress.sections.find((s) => s.sectionIndex === sIndex);
    if (!section) return false;
    const lesson = section.lessons.find((l) => l.lessonIndex === lIndex);
    return lesson?.completed || false;
  };

  const handleLessonClick = (newSectionIndex, newLessonIndex) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const currentSectionIdx = parseInt(sectionIndex);
    const currentLessonIdx = parseInt(lessonIndex);
    const currentCompleted = isLessonCompleted(currentSectionIdx, currentLessonIdx);

    // إذا كان الدرس المطلوب مكتملاً، يُسمح بالانتقال إليه
    const targetCompleted = isLessonCompleted(newSectionIndex, newLessonIndex);
    if (targetCompleted) {
      navigate(`/course/${courseId}/section/${newSectionIndex}/lesson/${newLessonIndex}`);
      return;
    }

    // تحديد إذا كان الدرس المطلوب لاحقًا للدرس الحالي
    const isTargetLater =
      newSectionIndex > currentSectionIdx ||
      (newSectionIndex === currentSectionIdx && newLessonIndex > currentLessonIdx);

    // إذا لم يكن الدرس الحالي مكتملاً وكان الدرس المطلوب لاحقًا، امنع الانتقال
    if (!currentCompleted && isTargetLater) {
      alert("Please complete the current lesson before moving to the next one.");
      return;
    }

    // السماح بالانتقال إذا كان الدرس المطلوب سابقًا أو هو نفسه الدرس الحالي
    navigate(`/course/${courseId}/section/${newSectionIndex}/lesson/${newLessonIndex}`);
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  if (loading) return <div className="loading-overlay"><div className="spinner"></div>Loading...</div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  const currentSection = course.sections[sectionIndex];
  const currentLesson = currentSection?.lessons[lessonIndex];
  const canViewLesson = user || (sectionIndex === "0" && lessonIndex === "0");

  if (!currentSection || !currentLesson) {
    return <div className="not-found-overlay">Lesson not found</div>;
  }

  return (
    <div className="lesson-page">
      <header className="lesson-page-header">
        <h1>{course.title}</h1>
      </header>

      <div className="lesson-page-container">

        <aside className="lesson-sidebar">
        {progress && (

          <div className="course-progress-container">
            <h3>Course Progress: {progress.completionPercentage.toFixed(2)}%</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.completionPercentage}%` }}
              ></div>
            </div>
            {/* <CourseProgress /> */}
          </div>
        )}
          <h3>Course Curriculum</h3>
          <div className="sections-stack">
            {course.sections.map((section, sIndex) => (
              <div key={sIndex} className="section-block">
                <div className="section-header" onClick={() => toggleSection(sIndex)}>
                  <h4>{section.title} ({section.lessons.length} Lessons)</h4>
                  <FaChevronDown
                    className={`toggle-icon ${openSection === sIndex ? "open" : ""}`}
                  />
                </div>
                <div className={`section-lessons ${openSection === sIndex ? "open" : ""}`}>
                  {section.lessons.map((lesson, lIndex) => {
                    const isLessonAccessible = user || (sIndex === 0 && lIndex === 0);
                    const completed = isLessonCompleted(sIndex, lIndex);
                    return (
                      <div
                        key={lIndex}
                        className={`lesson-block ${
                          sIndex === parseInt(sectionIndex) && lIndex === parseInt(lessonIndex)
                            ? "active"
                            : ""
                        } ${!isLessonAccessible ? "disabled" : ""}`}
                        onClick={() => handleLessonClick(sIndex, lIndex)}
                      >
                        <div className="lesson-media">
                          <img
                            src={lesson.thumbnailUrl || "https://via.placeholder.com/150x100.png?text=Lesson"}
                            alt={lesson.title}
                          />
                          {lesson.videoUrl && !lesson.videoUrl.startsWith("pending") && (
                            <FaPlayCircle className="play-overlay" />
                          )}
                        </div>
                        <div className="lesson-text">
                          <h5>
                            {sIndex + 1}.{lIndex + 1} {lesson.title}
                            {completed && <FaCheck className="completed-icon" />}
                          </h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="lesson-content">
          <h2>{currentLesson.title}</h2>
          {canViewLesson ? (
            currentLesson.videoUrl && !currentLesson.videoUrl.startsWith("pending") ? (
              <div className="lesson-video" ref={videoContainerRef} onContextMenu={handleContextMenu}>
                <ReactPlayer
                  ref={playerRef}
                  url={currentLesson.videoUrl}
                  controls={false}
                  width="100%"
                  height="100%"
                  className="react-player"
                  playing={playing}
                  volume={volume}
                  muted={muted}
                  onProgress={(state) => setVideoProgress(state.played * 100)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
                <div className="video-overlay"></div>
                <div
                  className="watermark"
                  style={{ top: watermarkPosition.top, left: watermarkPosition.left }}
                >
                  <Logo />
                </div>
                <div className="custom-controls">
                  <button onClick={handleRewind} className="control-button"><FaBackward /></button>
                  <button onClick={togglePlayPause} className="play-pause-button">
                    {playing ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={handleFastForward} className="control-button"><FaForward /></button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={videoProgress}
                    onChange={handleProgressChange}
                    className="custom-progress-bar"
                    style={{ "--progress": videoProgress }}
                  />
                  <button onClick={toggleMute} className="control-button">
                    {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                  <button onClick={toggleFullscreen} className="control-button">
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
            ) : (
              <p>No video available for this lesson.</p>
            )
          ) : (
            <div className="lesson-restricted">
              <p>This lesson is restricted. Please log in to view this content.</p>
              <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
            </div>
          )}
          <div className="lesson-details">
            <h3>Lesson Content</h3>
            <p>{currentLesson.content}</p>
            {currentLesson.quiz && (
              <div className="lesson-quiz">
                <h4>Quiz</h4>
                <p>{currentLesson.quiz}</p>
              </div>
            )}
            {canViewLesson && user && (
              <Button
                variant={isLessonCompleted(parseInt(sectionIndex), parseInt(lessonIndex)) ? "success" : "primary"}
                onClick={markLessonAsCompleted}
                disabled={isLessonCompleted(parseInt(sectionIndex), parseInt(lessonIndex))}
              >
                {isLessonCompleted(parseInt(sectionIndex), parseInt(lessonIndex)) ? "Completed" : "Mark as Completed"}
              </Button>
            )}
          </div>
        </main>
      </div>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>You must be logged in to view this lesson. Please log in to continue.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LessonPage;