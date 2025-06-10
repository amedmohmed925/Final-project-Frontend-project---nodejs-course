import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link
import { useDispatch, useSelector } from "react-redux";
import { getCourseDetailsWithoutVideos } from "../../api/courseApi";
import { getUserById } from "../../api/userApi";
import { addItemToCart } from "../../features/cart/cartSlice";
import {

  FaShoppingCart,
  FaPlayCircle,
  FaClock,
  FaBook,
  FaChevronDown,
  FaCheck,
  FaArrowRight,
  FaStar,
  FaLevelUpAlt,
  FaFolder,
  FaStarHalfAlt,
  FaUsers,
  FaTag,
  FaEye,

} from "react-icons/fa";
import { Modal, Button, Spinner } from "react-bootstrap";
import "../../styles/CourseDetails.css";
import FeedbackSection from "../FeedbackSection.js/FeedbackSection";
import ReactGA from "react-ga4";

ReactGA.initialize("G-XXXXXXX");

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);
  const [isLoginError, setIsLoginError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCourseAndTeacher = async () => {
      try {
        const courseData = await getCourseDetailsWithoutVideos(id);
        setCourse(courseData);

        if (courseData.teacherId) {
          const teacherId = courseData.teacherId._id || courseData.teacherId;
          const teacherData = await dispatch(getUserById(teacherId)).unwrap();
          setTeacher(teacherData || { firstName: "Unknown", lastName: "Instructor" });
        } else {
          setTeacher({ firstName: "Unknown", lastName: "Instructor" });
        }

        ReactGA.send({ hitType: "pageview", page: `/course/${id}` });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndTeacher();
  }, [id, dispatch]);

  const isInCart = items.some((item) => item.courseId._id === id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysPassed = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };



  const handleAddToCart = () => {
    if (!user) {
      setAddToCartError("You must be logged in to add this course to your cart.");
      setIsLoginError(true);
      setShowErrorModal(true);
      return;
    }

    if (typeof dispatch !== "function") {
      console.error("Dispatch is not a function:", dispatch);
      setAddToCartError("Failed to add course to cart: Redux dispatch error");
      setIsLoginError(false);
      setShowErrorModal(true);
      return;
    }

    dispatch(addItemToCart(id))
      .unwrap()
      .then(() =>
        ReactGA.event({
          category: "Cart",
          action: "Add to Cart",
          label: course.title,
          value: course.price,
        })
      )
      .catch((err) => {
        setAddToCartError(err.message || "Failed to add course to cart");
        setIsLoginError(false);
        setShowErrorModal(true);
      });
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setAddToCartError(null);
    setIsLoginError(false);
  };

  const handleLoginRedirect = () => {
    handleCloseModal();
    navigate("/login");
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
    ReactGA.event({
      category: "Engagement",
      action: "Toggle Section",
      label: `${course?.title} - Section ${index + 1}`,
      value: openSection === index ? 0 : 1,
    });
  };

  const handleLessonClick = (sectionIndex, lessonIndex) => {
    navigate(`/course/${id}/section/${sectionIndex}/lesson/${lessonIndex}`);
  };

  if (loading) return <div className="loading-overlay"><Spinner /></div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const daysPassed = course.createdAt ? calculateDaysPassed(course.createdAt) : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(<FaStarHalfAlt key={fullStars + 1} className="star filled" />);
    }

    const remainingStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 1; i <= remainingStars; i++) {
      stars.push(<FaStar key={fullStars + (hasHalfStar ? 2 : 1) + i} className="star" />);
    }

    return stars;
  };

  return (
    <div className="course-details-page">
      <main className="course-main ">
        <section className="course-banner-section">
          <div className="banner-content container">
            <div className="banner-text">
              <h1 className="banner-title">{course.title}</h1>
              <p className="banner-description">{course.description}</p>
              <div className="banner-meta">
                <div className="rating">
                  <div className="course-rating">
                    <span>({course.averageRating || 0})</span>
                    {renderStars(course.averageRating || 0)}
                  </div>
                </div>
                <span className="created-date">Created: {formatDate(course.createdAt)}</span>
                <span className="views"><FaEye /> {course.views} Views</span>
              </div>
            </div>
            <div className="banner-image">
              <img
                src={course.featuredImage || "https://via.placeholder.com/400x250.png?text=Course+Image"}
                alt={course.title}
              />
            </div>
          </div>
        </section>
        <div className="d-flex justify-content-center px-5" style={{ flexDirection: "row-reverse" }}>
          <section className="pricing-section">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="price">${course.price}</h3>
                <p className="days-passed">Created {daysPassed} days ago</p>
              </div>
              <button
                className={`add-to-cart-btn ${isInCart ? "disabled" : ""}`}
                onClick={!isInCart ? handleAddToCart : null}
                disabled={isInCart}
              >
                {isInCart ? (
                  <>
                    <FaCheck /> Added to Cart
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> Add to Cart
                  </>
                )}
              </button>
              <div className="course-meta">
                <p><FaClock /> Duration: {totalLessons * 2} Hours</p>
                <p><FaBook /> Lessons: {totalLessons}</p>
                <p><FaLevelUpAlt /> Level: {course.level}</p>
                <p><FaFolder /> Category: {course.category}</p>
              </div>
            </div>
          </section>

          <div className="d-flex" style={{ flexDirection: "column" }}>
            <section className="course-section">
              <h3>What You'll Learn</h3>
              <div className="feature-list">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="feature-item">
                    <FaArrowRight className="feature-iconWhatYouLearn" /> {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="course-section">
              <h3>Course Content</h3>
              <div className="course-content-meta">
                <p><FaBook /> {totalLessons} Lessons • {totalLessons * 2} Hours</p>
                <p><FaLevelUpAlt /> Level: {course.level}</p>
                <p><FaFolder /> Category: {course.category}</p>
                {/* Updated teacher info with Link */}
                {teacher ? (
                  <div className="teacher-info">
                    <p>
                      By{" "}
                      <Link to={`/teacher/${teacher._id}`} className="teacher-link">
                        {teacher.firstName} {teacher.lastName}
                      </Link>
                    </p>
                    
                  </div>
                ) : (
                  <p>By Loading...</p>
                )}
              </div>

              <div className="sections-stack">
                {course.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="section-block">
                    <div className="section-header" onClick={() => toggleSection(sectionIndex)}>
                      <h4>{section.title}</h4>
                      <FaChevronDown
                        className={`toggle-icon ${openSection === sectionIndex ? "open" : ""}`}
                      />
                    </div>
                    <div className={`section-lessons ${openSection === sectionIndex ? "open" : ""}`}>
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="lesson-block"
                          onClick={() => handleLessonClick(sectionIndex, lessonIndex)}
                        >
                          <div className="lesson-media">
                            <img
                              src={lesson.thumbnailUrl || "https://via.placeholder.com/150x100.png?text=Lesson"}
                              alt={lesson.title}
                            />
                            <FaPlayCircle className="play-overlay" />
                          </div>
                          <div className="lesson-text">
                            <h5>{lesson.title}</h5>
                            <p>{lesson.content.substring(0, 80)}...</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="course-section">
              <h3>Target Audience</h3>
              <div className="feature-list">
                {course.targetAudience.map((item, index) => (
                  <div key={index} className="feature-item">
                    <FaUsers className="feature-iconWhatYouLearn" /> {item}
                  </div>
                ))}
              </div>
            </section>
            <section className="course-section">
              <h3>Tags</h3>
              <div className="tags-list">
                {course.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    <FaTag /> {tag}
                  </span>
                ))}
              </div>
            </section>

           
          </div>
        </div>

        <FeedbackSection courseId={id} />
      </main>

      <Modal show={showErrorModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{addToCartError || "An unexpected error occurred."}</Modal.Body>
        <Modal.Footer>
          {isLoginError ? (
            <>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              <Button variant="primary" onClick={handleLoginRedirect}>Login</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseDetails;