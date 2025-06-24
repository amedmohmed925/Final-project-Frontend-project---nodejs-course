import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllCoursesPreview } from "../../courses/api/courseApi";
import "../../courses/styles/Courses.css"; // Reuse course card styles
import { Spinner, Container, Row, Col } from "react-bootstrap";
import HeaderPages from "../../../shared/components/HeaderPages";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const SearchResults = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL
  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  // Fetch all courses and filter based on query
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getAllCoursesPreview();
        const filtered = coursesData.filter((course) =>
          course.category.toLowerCase().includes(query) || // Match category
          course.tags.some((tag) => tag.toLowerCase().includes(query)) || // Match tags
          course.description.toLowerCase().includes(query) // Match description
        );
        setCourses(coursesData);
        setFilteredCourses(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [query]);

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
    <div className="search-results-page" style={{ minHeight: "100vh" }}>
      <HeaderPages title={`Search Results for "${query}"`} />
      <Container className="py-5">
        <Row>
          <Col>
            {filteredCourses.length > 0 ? (
              <>
                <div className="courses-grid">
                  {filteredCourses.slice(0, visibleCount).map((course) => (
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

                <div className="button-container text-center mt-4">
                  {visibleCount < filteredCourses.length && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                    >
                      Load More
                    </button>
                  )}
                  {visibleCount > 6 && (
                    <button
                      className="btn btn-outline-secondary mx-2"
                      onClick={() => setVisibleCount(6)}
                    >
                      Show Less
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center">No courses found matching your search.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchResults;