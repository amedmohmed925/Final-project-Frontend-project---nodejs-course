// src/components/CourseDetails.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../api/courseApi";
import { FaHeart, FaShareAlt, FaShoppingCart, FaPlayCircle, FaClock, FaBook, FaChevronDown } from "react-icons/fa";
import "../../styles/CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSection, setOpenSection] = useState(null); // للتحكم في فتح/طي الأقسام
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Course link copied to clipboard!");
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  if (loading) return <div className="loading-overlay"><div className="spinner"></div>Loading...</div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  // حساب إجمالي عدد الحلقات عبر جميع الأقسام
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);

  return (
    <div className="course-depth-page">
      {/* Sticky Header */}
      <header className="course-sticky-header">
        <div className="header-content">
          <h1 className="course-title text-light">{course.title}</h1>
          <div className="quick-actions">
            <button className="action-icon" onClick={handleFavoriteToggle}>
              <FaHeart className={isFavorite ? "active" : ""} />
            </button>
            <button className="action-icon" onClick={handleShare}>
              <FaShareAlt />
            </button>
            <button className="action-icon">
              <FaShoppingCart />
            </button>
            <button className="enroll-sticky-btn" onClick={() => alert("Enrollment coming soon!")}>
              Enroll - ${course.price}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="course-banner">
  <div className="banner-overlay">
    <img
      src={course.featuredImage || "https://via.placeholder.com/1200x400.png?text=Course+Banner"}
      alt={course.title}
    />
  </div>
  <div className="banner-content">
    <h2>{course.title}</h2>
    <p className="banner-description">{course.description.substring(0, 150)}...</p>
    <div className="banner-stats">
      <span><FaClock /> {totalLessons * 2} Hours</span>
      <span><FaBook /> {totalLessons} Lessons</span>
      <span>{course.level}</span>
    </div>
  </div>
</section>

      {/* Main Layout */}
      <div className="course-grid">
        {/* Left Column: Overview & Details */}
        <div className="course-details-column">
          <section className="course-section overview">
            <h3>What You'll Learn</h3>
            <p>{course.description}</p>
            <div className="feature-list">
              <div className="feature-item">Master {course.category} skills</div>
              <div className="feature-item">{totalLessons} hands-on lessons</div>
              <div className="feature-item">Real-world projects</div>
              <div className="feature-item">Certificate upon completion</div>
            </div>
          </section>

          <section className="course-section details">
            <h3>Course Details</h3>
            <div className="details-grid">
              <p><strong>Price:</strong> ${course.price}</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Created:</strong> {formatDate(course.createdAt)}</p>
            </div>
            {course.tags.length > 0 && (
              <div className="tags-section">
                <h4>Tags</h4>
                <div className="tags-cloud">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sections */}
        <div className="course-lessons-column">
          <section className="course-section lessons">
            <h3>Course Curriculum</h3>
            <div className="sections-stack">
              {course.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="section-block">
                  <div
                    className="section-header"
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <h4>{section.title} ({section.lessons.length} Lessons)</h4>
                    <FaChevronDown
                      className={`toggle-icon ${openSection === sectionIndex ? "open" : ""}`}
                    />
                  </div>
                  <div
                    className={`section-lessons ${openSection === sectionIndex ? "open" : ""}`}
                  >
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="lesson-block">
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
                          <h5>{sectionIndex + 1}.{lessonIndex + 1} {lesson.title}</h5>
                          <p>{lesson.content.substring(0, 80)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* Footer Actions */}
      <footer className="course-footer">
        <button className="back-btn" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </footer>
    </div>
  );
};

export default CourseDetails;