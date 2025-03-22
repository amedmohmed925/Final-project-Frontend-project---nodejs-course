import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCourseById } from "../../api/courseApi";
import { FaChevronDown, FaPlayCircle, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaForward, FaBackward, FaExpand, FaCompress } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import ReactPlayer from "react-player";
import "../../styles/LessonPage.css";
import Logo from "../Logo";

const LessonPage = () => {
  const { courseId, sectionIndex, lessonIndex } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(parseInt(sectionIndex));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState({ top: "10%", left: "10%" });
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // جلب حالة المستخدم من Redux

  // جلب بيانات الكورس
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // تحريك العلامة المائية بشكل عشوائي كل ثانيتين
  useEffect(() => {
    const moveWatermark = () => {
      const maxTop = 10;
      const maxLeft = 10;
      setWatermarkPosition({ top: maxTop, left: maxLeft });
    };

    const interval = setInterval(moveWatermark, 2000);
    return () => clearInterval(interval);
  }, []);

  // متابعة حالة ملء الشاشة
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // منع النقر بالزر الأيمن
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // التحكم في التشغيل/الإيقاف
  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  // التحكم في الصوت (mute/unmute)
  const toggleMute = () => {
    setMuted(!muted);
  };

  // التحكم في مستوى الصوت
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  // تقديم الفيديو 10 ثواني
  const handleFastForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = currentTime + 10;
      playerRef.current.seekTo(newTime);
    }
  };

  // تأخير الفيديو 10 ثواني
  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.max(currentTime - 10, 0);
      playerRef.current.seekTo(newTime);
    }
  };

  // التحكم في الفيديو عن طريق سحب شريط التقدم
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      const newTime = (newProgress / 100) * duration;
      playerRef.current.seekTo(newTime);
    }
  };

  // الدخول لوضع ملء الشاشة
  const enterFullscreen = () => {
    if (videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    }
  };

  // الخروج من وضع ملء الشاشة
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  // التحكم في وضع ملء الشاشة
  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleLessonClick = (newSectionIndex, newLessonIndex) => {
    navigate(`/course/${courseId}/section/${newSectionIndex}/lesson/${newLessonIndex}`);
  };

  if (loading) return <div className="loading-overlay"><div className="spinner"></div>Loading...</div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  const currentSection = course.sections[sectionIndex];
  const currentLesson = currentSection?.lessons[lessonIndex];

  if (!currentSection || !currentLesson) {
    return <div className="not-found-overlay">Lesson not found</div>;
  }

  // التحقق من إذا كان المستخدم يمكنه مشاهدة الحلقة
  const canViewLesson = user || (sectionIndex === "0" && lessonIndex === "0");

  return (
    <div className="lesson-page">
      <header className="lesson-page-header">
        <h1>{course.title}</h1>
      </header>

      <div className="lesson-page-container">
        <aside className="lesson-sidebar">
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
                    return (
                      <div
                        key={lIndex}
                        className={`lesson-block ${
                          sIndex === parseInt(sectionIndex) && lIndex === parseInt(lessonIndex)
                            ? "active"
                            : ""
                        } ${!isLessonAccessible ? "disabled" : ""}`}
                        onClick={() => {
                          if (isLessonAccessible) {
                            handleLessonClick(sIndex, lIndex);
                          } else {
                            setShowLoginModal(true);
                          }
                        }}
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
                          <h5>{sIndex + 1}.{lIndex + 1} {lesson.title}</h5>
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
                  onProgress={(state) => {
                    if (!playerRef.current) return;
                    const newProgress = state.played * 100;
                    setProgress(newProgress);
                  }}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onReady={() => console.log("Video is ready to play")}
                  onError={(e) => console.log("Error loading video:", e)}
                />
                <div className="video-overlay"></div>
                <div
                  className="watermark"
                  style={{
                    top: watermarkPosition.top,
                    left: watermarkPosition.left,
                  }}
                >
                  <Logo />
                </div>
                {/* أدوات التحكم المخصصة */}
                <div className="custom-controls">
                  <button onClick={handleRewind} className="control-button">
                    <FaBackward />
                  </button>
                  <button onClick={togglePlayPause} className="play-pause-button">
                    {playing ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={handleFastForward} className="control-button">
                    <FaForward />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    onChange={handleProgressChange}
                    className="custom-progress-bar"
                    style={{ "--progress": progress }}
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
              <Button variant="primary" onClick={() => navigate("/login")}>
                Login
              </Button>
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
          </div>
        </main>
      </div>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You must be logged in to view this lesson. Please log in to continue.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LessonPage;