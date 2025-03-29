import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCoursesPreview } from "../../api/courseApi"; // Fetch all courses
import { getCategoryById } from "../../api/categoryApi"; // Fetch category by ID
import "../../styles/Courses.css"; // Reuse the same styles
import { Spinner } from "react-bootstrap";
import HeaderPages from "../../components/HeaderPages";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const CategoryCourses = () => {
  const { categoryId } = useParams(); // Get category ID from URL
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch category and courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, categoryData] = await Promise.all([
          getAllCoursesPreview(), // Fetch all courses
          getCategoryById(categoryId), // Fetch category details
        ]);
        // Filter courses by category
        const filteredCourses = coursesData.filter(
          (course) => course.category === categoryData.name
        );
        setCourses(filteredCourses);
        setCategory(categoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const handleImageError = (e) => {
    e.target.src = "path/to/fallback-image.jpg"; // Replace with your fallback image path
  };

  const truncateDescription = (description) => {
    return description.length > 50 ? description.substring(0, 50) + "..." : description;
  };

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

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      </div>
    );
  }

  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      <HeaderPages title={`${category?.name || "Category"}`} />
      <div className="courses-container">
        <div className="courses-grid">
          {courses.slice(0, visibleCount).map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img
                  src={course.featuredImage}
                  alt={course.title}
                  onError={handleImageError}
                />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{truncateDescription(course.description)}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="course-rating">
                    {renderStars(course.averageRating)}
                    <span>({course.averageRating})</span>
                  </div>
                  <span className="courseLevel">{course.level}</span>
                </div>
                <button
                  className="enroll-btn d-flex justify-content-center"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  Enroll Now
                  <div className="mx-2">${course.price}</div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="button-container">
          {visibleCount < courses.length && (
            <button
              className="show-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
              Show More
            </button>
          )}
          {visibleCount > 6 && (
            <button className="show-less-btn" onClick={() => setVisibleCount(6)}>
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCourses;