import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeacherDetails } from "../api/instructorsApi";
import {
  FaGraduationCap,
  FaCalendarAlt,
  FaUserShield,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaMedal,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import "../styles/InstructorDetails.css";

const InstructorDetails = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        const data = await getTeacherDetails(id);
        setInstructor(data.teacher);
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching instructor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="error-message">
        <FaChalkboardTeacher size={50} />
        <h2>Instructor not found</h2>
      </div>
    );
  }

  return (
    <div className="instructor-details py-5 animate__animated animate__fadeIn">
      <Row className="justify-content-center container">
        <Col lg={10}>
          <Card className="profile-card shadow-lg">
            <div className="profile-header">
              <div className="profile-cover"></div>
              <div className="profile-avatar">
                <img
                  src={
                    instructor.profileImage ||
                    "https://courssat.com/assets/images/home/avatar.png"
                  }
                  alt={instructor.firstName}
                  className="instructor-image"
                />
                {instructor.isVerified && (
                  <Badge className="verification-badge">
                    <FaCheckCircle /> Verified
                  </Badge>
                )}
              </div>
            </div>

            <Card.Body className="text-center">
              <h1 className="instructor-name mb-3">
                {instructor.firstName} {instructor.lastName}
                <FaMedal className="medal-icon" />
              </h1>

              <p className="instructor-bio">
                {instructor.bio && instructor.bio !== ""
                  ? instructor.bio
                  : "This instructor has not provided a bio."}
              </p>

              <Row className="info-grid mt-4">
                <Col md={6} lg={4} className="info-item">
                  <Card className="h-100 info-card">
                    <Card.Body>
                      <FaGraduationCap className="info-icon" />
                      <h5>Education</h5>
                      <p>
                        {instructor.graduationYear ||
                          "Graduation year not provided"}
                      </p>
                      <p>
                        {instructor.university || "University not provided"}
                      </p>
                      <p>{instructor.major || "Major not provided"}</p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={4} className="info-item">
                  <Card className="h-100 info-card">
                    <Card.Body>
                      <FaUserShield className="info-icon" />
                      <h5>Role & Status</h5>
                      <p>Role: {instructor.role}</p>
                      <p>
                        Member since:{" "}
                        {new Date(instructor.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Last updated:{" "}
                        {new Date(instructor.updatedAt).toLocaleDateString()}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={4} className="info-item">
                  <Card className="h-100 info-card">
                    <Card.Body>
                      <FaCalendarAlt className="info-icon" />
                      <h5>Personal Info</h5>
                      <p>
                        Date of Birth:{" "}
                        {new Date(instructor.dob).toLocaleDateString()}
                      </p>
                      <p className="d-flex justify-content-center flex-row gap-1 align-items-center">
                        Status:{" "}
                        <span
                          className={
                            instructor.isVerified
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {instructor.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Courses Section */}
      <Container className="courses-section">
        <h2 className="section-title">
          Courses by {instructor.firstName}
        </h2>
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img
                  src={course.featuredImage || "https://via.placeholder.com/300"}
                  alt={course.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-rating mb-2">
                  {renderStars(course.averageRating || 0)}
                  <span className="ms-2">{(course.averageRating !== undefined && course.averageRating !== null) ? course.averageRating.toFixed(1) : "0.0"}</span>
                </div>
                <p className="course-description">
                  {truncateDescription(course.description)}
                </p>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="courseLevel">{course.level}</span>
                </div>
                <div className="course-footer">
                  <span className="course-price">${course.price}</span>
                  <button
                    className="enroll-btn"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-center text-muted">
            No courses available from this instructor yet.
          </p>
        )}
      </Container>
    </div>
  );
};

export default InstructorDetails;
