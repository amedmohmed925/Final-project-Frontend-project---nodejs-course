import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeacherDetails } from "../api/instructorsApi";
import {
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaChalkboardTeacher,
  FaMedal,
} from "react-icons/fa";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import "../styles/InstructorDetails.css";

const InstructorDetails = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]); // State for courses
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        const data = await getTeacherDetails(id);
        setInstructor(data.teacher);
        setCourses(data.courses); // Set courses from response
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
                      <p>Date of Birth: {new Date(instructor.dob).toLocaleDateString()}</p>
                      <p>
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

              {/* Courses Section */}
              <div className="courses-section mt-5">
                <h2 className="section-title">Courses by {instructor.firstName}</h2>
                <Row className="courses-grid">
                  {courses.map((course) => (
                    <Col md={6} lg={4} key={course._id} className="mb-4">
                      <Card className="course-card" onClick={() => navigate(`/courses/${course._id}`)}>
                        <Card.Img
                          variant="top"
                          src={course.featuredImage || "https://via.placeholder.com/300"}
                          alt={course.title}
                          className="course-image"
                        />
                        <Card.Body>
                          <Card.Title className="course-title">{course.title}</Card.Title>
                          <Card.Text className="course-description">
                            {course.description.length > 100
                              ? `${course.description.substring(0, 100)}...`
                              : course.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="course-price">${course.price}</span>
                            <span className="course-level">{course.level}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorDetails;
