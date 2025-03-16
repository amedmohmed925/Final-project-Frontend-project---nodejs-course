import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCourseById } from "../../api/courseApi";
import { addItemToCart } from "../../features/cart/cartSlice";
import { FaHeart, FaShareAlt, FaShoppingCart, FaPlayCircle, FaClock, FaBook, FaChevronDown, FaCheck } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "../../styles/CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

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

  // مراقبة تغيير items لتحديث الـ UI فورًا
  const isInCart = items.some((item) => item.courseId._id === id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Course link copied to clipboard!");
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart(id))
      .unwrap()
      .catch((err) => {
        setAddToCartError(err.message || "Failed to add course to cart");
        setShowErrorModal(true);
      });
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setAddToCartError(null);
  };

  if (loading) return <div className="loading-overlay"><div className="spinner"></div>Loading...</div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);

  return (
    <div className="course-depth-page">
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
            <button
              className={`action-icon ${isInCart ? "disabled" : ""}`}
              onClick={!isInCart ? handleAddToCart : null}
              disabled={isInCart}
              title={isInCart ? "Already in cart" : "Add to cart"}
            >
              {isInCart ? <FaCheck className="text-sucئcess" style={{color: "#90EE90" }} /> : <FaShoppingCart />}
            </button>
            <button className="enroll-sticky-btn" onClick={() => alert("Enrollment coming soon!")}>
              Enroll - ${course.price}
            </button>
          </div>
        </div>
      </header>

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

      <div className="course-grid">
        <div className="course-details-column">
          <section className="course-section overview">
            <h3>What You'll Learn</h3>
            <p>{course.description}</p>
            <div className="feature-list">
              <div className="feature-item">Master {course.category} skills</div>
              <div className="feature-item">{totalLessons} hands-on lessons</div>
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

        <div className="course-lessons-column">
          <section className="course-section lessons">
            <h3>Course Curriculum</h3>
            <div className="sections-stack">
              {course.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="section-block">
                  <div className="section-header" onClick={() => toggleSection(sectionIndex)}>
                    <h4>{section.title} ({section.lessons.length} Lessons)</h4>
                    <FaChevronDown
                      className={`toggle-icon ${openSection === sectionIndex ? "open" : ""}`}
                    />
                  </div>
                  <div className={`section-lessons ${openSection === sectionIndex ? "open" : ""}`}>
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

      <footer className="course-footer">
        <button className="back-btn" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </footer>

      <Modal show={showErrorModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{addToCartError || "An unexpected error occurred."}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseDetails;