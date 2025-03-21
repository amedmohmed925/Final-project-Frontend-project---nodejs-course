import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCourseById } from "../../api/courseApi";
import { getUserById } from "../../api/userApi"; // دالة لجلب بيانات المعلم
import { addItemToCart } from "../../features/cart/cartSlice";
import { FaHeart, FaShareAlt, FaShoppingCart, FaPlayCircle, FaClock, FaBook, FaChevronDown, FaCheck, FaArrowRight, FaUser, FaDollarSign, FaLevelUpAlt, FaFolder, FaCalendarAlt, FaTools, FaUsers } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "../../styles/CourseDetails.css";
import FeedbackSection from "../FeedbackSection.js/FeedbackSection";
import ReactGA from "react-ga4";
import HeaderPages from "../HeaderPages";

ReactGA.initialize("G-XXXXXXX");

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [teacher, setTeacher] = useState(null); // حالة لتخزين بيانات المعلم
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
    const fetchCourseAndTeacher = async () => {
      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);

        // جلب بيانات المعلم
        const teacherData = await getUserById(courseData.teacherId);
        setTeacher(teacherData);

        ReactGA.send({ hitType: "pageview", page: `/course/${id}` });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndTeacher();
  }, [id]);

  const isInCart = items.some((item) => item.courseId._id === id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    ReactGA.event({ category: "Engagement", action: "Toggle Favorite", label: course?.title, value: isFavorite ? 0 : 1 });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Course link copied to clipboard!");
    ReactGA.event({ category: "Engagement", action: "Share Course", label: course?.title });
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart(id))
      .unwrap()
      .then(() => ReactGA.event({ category: "Cart", action: "Add to Cart", label: course.title, value: course.price }))
      .catch((err) => {
        setAddToCartError(err.message || "Failed to add course to cart");
        setShowErrorModal(true);
      });
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
    ReactGA.event({ category: "Engagement", action: "Toggle Section", label: `${course?.title} - Section ${index + 1}`, value: openSection === index ? 0 : 1 });
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setAddToCartError(null);
  };

  const handleLessonClick = (sectionIndex, lessonIndex) => {
    navigate(`/course/${id}/section/${sectionIndex}/lesson/${lessonIndex}`);
  };

  if (loading) return <div className="loading-overlay"><div className="spinner"></div>Loading...</div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);

  return (
    <div className="course-depth-page">
      <HeaderPages title={course.title}/>
      <header className="course-sticky-header">
        <div className="header-content">
          <h1 className="course-title text-light">{course.title}</h1>
          <div className="quick-actions">
            <button className="action-icon" onClick={handleFavoriteToggle} title="Add to Favorites">
              <FaHeart className={isFavorite ? "active" : ""} />
            </button>
            <button className="action-icon" onClick={handleShare} title="Share Course">
              <FaShareAlt />
            </button>
            <button
              className={`action-icon ${isInCart ? "disabled" : ""}`}
              onClick={!isInCart ? handleAddToCart : null}
              disabled={isInCart}
              title={isInCart ? "Already in cart" : "Add to cart"}
            >
              {isInCart ? <FaCheck className="text-success" style={{ color: "#90EE90" }} /> : <FaShoppingCart />}
            </button>
            <button className="enroll-sticky-btn" onClick={() => alert("Enrollment coming soon!")}>
              Enroll - ${course.price}
            </button>
          </div>
        </div>
      </header>

      <section className="course-banner">
        <div className="banner-overlay">
          <img src={course.featuredImage || "https://via.placeholder.com/1200x400.png?text=Course+Banner"} alt={course.title} />
        </div>
        <div className="banner-content">
          <h2>{course.title}</h2>
          <p className="banner-description">{course.description.substring(0, 150)}...</p>
          <div className="banner-stats">
            <span><FaClock /> {totalLessons * 2} Hours</span>
            <span><FaBook /> {totalLessons} Lessons</span>
            <span>{course.level}</span>
            <span>By {teacher ? teacher.name : "Loading..."}</span>
          </div>
        </div>
      </section>

      <div className="course-grid container">
        <div className="course-details-column">
          <section className="course-section overview">
            <h3>What You'll Learn</h3>
            <p>{course.description}</p>
            <div className="feature-list">
              {course.whatYouWillLearn.map((item, index) => (
                <div key={index} className="feature-item">
                  <FaArrowRight className="feature-icon" /> {item}
                </div>
              ))}
            </div>
          </section>

          <section className="course-section details">
          <h3>Course Details</h3>
  <div className="details-grid">
    <h4>
      <FaUser className="detail-icon" /> <span>Instructor:</span> {teacher ? teacher.name : "Loading..."}
    </h4>
    <h4>
      <FaDollarSign className="detail-icon" /> <span>Price:</span> ${course.price}
    </h4>
    <h4>
      <FaLevelUpAlt className="detail-icon" /> <span>Level:</span> {course.level}
    </h4>
    <h4>
      <FaFolder className="detail-icon" /> <span>Category:</span> {course.category}
    </h4>
    <h4>
      <FaCalendarAlt className="detail-icon" /> <span>Created:</span> {formatDate(course.createdAt)}
    </h4>
  </div>
  <div className="d-flex justify-content-between">
    <div className="requirements-section">
      <h4>
        <FaTools className="section-icon" /> Requirements
      </h4>
      <ul className="requirements-list">
        {course.requirements.map((item, index) => (
          <li key={index}>
            <FaArrowRight className="requirement-icon" /> {item}
          </li>
        ))}
      </ul>
    </div>

            <div className="audience-section">
      <h4>
        <FaUsers className="section-icon" /> Target Audience
      </h4>
      <ul className="audience-list">
        {course.targetAudience.map((item, index) => (
          <li key={index}>
            <FaArrowRight className="audience-icon" /> {item}
          </li>
        ))}
      </ul>
    </div>
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
                    <FaChevronDown className={`toggle-icon ${openSection === sectionIndex ? "open" : ""}`} />
                  </div>
                  <div className={`section-lessons ${openSection === sectionIndex ? "open" : ""}`}>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="lesson-block"
                        onClick={() => handleLessonClick(sectionIndex, lessonIndex)}
                      >
                        <div className="lesson-media">
                          <img src={lesson.thumbnailUrl || "https://via.placeholder.com/150x100.png?text=Lesson"} alt={lesson.title} />
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

      <FeedbackSection courseId={id} />

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
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseDetails;