// src/components/CourseDetails.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../api/courseApi";
import { FaHeart, FaShareAlt, FaShoppingCart, FaPlayCircle } from "react-icons/fa";
import "../../styles/CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
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
    // يمكنك إضافة منطق لإضافة الكورس إلى المفضلة في الـ Backend هنا
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Course link copied to clipboard!");
  };

  if (loading) return <div className="loading">Loading course details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!course) return <div className="not-found">Course not found</div>;

  return (
    <div className="course-details-container">
      {/* Header */}
      <div className="course-header">
        <h1 className="course-details-title">{course.title}</h1>
        <p className="course-subtitle">{course.description.substring(0, 100)}...</p>
        <div className="course-actions">
          <button
            className={`action-btn favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteToggle}
          >
            <FaHeart /> {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button className="action-btn share-btn" onClick={handleShare}>
            <FaShareAlt /> Share
          </button>
          <button className="action-btn cart-btn">
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      <div className="course-details-content">
        {/* Main Content */}
        <div className="course-main">
          <div className="course-image">
            <img
              src={course.featuredImage || "https://via.placeholder.com/600x400.png?text=Course+Image"}
              alt={course.title}
            />
          </div>

          <div className="course-info">
            <h2>About This Course</h2>
            <p className="course-description">{course.description}</p>

            <div className="course-meta">
              <p><strong>Price:</strong> ${course.price}</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Created At:</strong> {formatDate(course.createdAt)}</p>
              <p><strong>Total Lessons:</strong> {course.lessons.length}</p>
            </div>

            {course.tags.length > 0 && (
              <div className="course-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn-custom enroll-btn"
              onClick={() => alert("Enrollment functionality coming soon!")}
            >
              Enroll Now
            </button>
            <button className="btn-custom back-btn" onClick={() => navigate("/courses")}>
              Back to Courses
            </button>
          </div>
        </div>

        {/* Lessons Sidebar */}
        <div className="course-lessons-sidebar">
          <h3>Course Content</h3>
          <div className="lessons-list">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="lesson-item">
                <div className="lesson-thumbnail">
                  <img
                    src={lesson.thumbnailUrl || "https://via.placeholder.com/100x60.png?text=Lesson"}
                    alt={lesson.title}
                  />
                  {lesson.videoUrl && !lesson.videoUrl.startsWith("pending") && (
                    <FaPlayCircle className="play-icon" />
                  )}
                </div>
                <div className="lesson-details">
                  <h4>{lesson.title}</h4>
                  <p>{lesson.content.substring(0, 50)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;