import React, { useEffect, useState } from 'react';
import { getPurchasedCourses } from '../api/purchasedCoursesApi';
import { Spinner, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import '../../courses/styles/Courses.css';

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPurchasedCourses()
      .then((data) => setCourses(data))
      .catch((err) => setError(err.message || 'Failed to fetch courses'))
      .finally(() => setLoading(false));
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x180?text=Image+Not+Found';
  };

  const truncateDescription = (description) => {
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading ...</span>
        </Spinner>
      </div>
    );
  }

  if (error) return <div className="text-danger text-center py-4">{error}</div>;

  return (
    <div className="courses-container">
      <h2 className="mb-4 text-center">My Purchased Courses</h2>
      <Row>
        {courses.length === 0 && (
          <div className="text-center py-4">You have not purchased any courses yet.</div>
        )}
        {courses.map((course) => (
          <Col md={6} lg={4} key={course._id} className="mb-4">
            <div className="course-card">
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
                    {renderStars(course.averageRating || 0)}
                    <span>({course.averageRating || 0})</span>
                  </div>
                  <span className="courseLevel">{course.level}</span>
                </div>
                <Button
                  className="enroll-btn d-flex justify-content-center mt-2"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  Go to Course
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PurchasedCourses;
