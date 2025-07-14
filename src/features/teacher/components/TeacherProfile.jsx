import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { getUserById } from "../../user/api/userApi"; // Assuming this API exists
import { Container, Row, Col, Card, Spinner, Modal } from "react-bootstrap";
import { FaGraduationCap, FaUniversity, FaBook, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaUser, FaEnvelope, FaCalendarAlt, FaLock, FaInfoCircle, FaShareAlt } from "react-icons/fa";
import "../styles/TeacherProfile.css"; // Create this CSS file for styling

const TeacherProfile = () => {
  const { teacherId } = useParams(); // Get teacher ID from URL
  const dispatch = useDispatch(); // Initialize dispatch
  const { user: currentUser } = useSelector((state) => state.user); // Get current user from Redux
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false); // State for image modal

  const handleImageClick = () => setShowImageModal(true); // Open modal
  const handleCloseImageModal = () => setShowImageModal(false); // Close modal

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teacherData = await dispatch(getUserById(teacherId)).unwrap(); // Use dispatch to call getUserById
        setTeacher(teacherData);
      } catch (err) {
        setError(err.message || "Failed to load teacher profile");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId, dispatch]);

  if (loading) return <div className="loading-overlay"><Spinner /></div>;
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!teacher) return <div className="not-found-overlay">Teacher not found</div>;

  return (
    <Container className="teacher-profile-page my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <img
                  src={teacher.profileImage || "https://via.placeholder.com/150"}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  className="rounded-circle mb-3 shadow"
                  style={{ width: "150px", height: "150px", objectFit: "cover", cursor: "pointer", border: "3px solid #6a11cb" }}
                  onClick={handleImageClick} // Add click handler
                />
                <h2 style={{ fontWeight: "bold", color: "#6a11cb" }}>{`${teacher.firstName} ${teacher.lastName}`}</h2>
                <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                  {teacher.role === "teacher" ? "Instructor" : teacher.role}
                </p>
              </div>

              {/* Modal for Enlarged Image */}
              <Modal show={showImageModal} onHide={handleCloseImageModal} centered>
                <Modal.Body className="text-center">
                  <img
                    src={teacher.profileImage || "https://via.placeholder.com/150"}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                  />
                </Modal.Body>
              </Modal>

              <Row>
                <Col md={6} className="mb-3">
                  <h5 style={{ color: "#6a11cb" }}><FaGraduationCap className="me-2" /> Certificates</h5>
                  <ul style={{ paddingLeft: "20px" }}>
                    {teacher.certificates && teacher.certificates.length > 0 ? (
                      teacher.certificates.map((cert, index) => <li key={index} style={{ marginBottom: "5px" }}>{cert}</li>)
                    ) : (
                      <p>No certificates listed</p>
                    )}
                  </ul>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 style={{ color: "#6a11cb" }}><FaUniversity className="me-2" /> Education</h5>
                  <p><FaBook className="me-2" /> Major: {teacher.major}</p>
                  <p><FaUniversity className="me-2" /> {teacher.university} ({teacher.graduationYear})</p>
                </Col>
              </Row>

              {currentUser?.role === "admin" && ( // Only show this section if current user is admin
                <Row>
                  <Col md={6} className="mb-3">
                    <h5 style={{ color: "#6a11cb" }}><FaUser className="me-2" /> Username</h5>
                    <p>{teacher.username}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <h5 style={{ color: "#6a11cb" }}><FaEnvelope className="me-2" /> Email</h5>
                    <p>{teacher.email}</p>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={6} className="mb-3">
                  <h5 style={{ color: "#6a11cb" }}><FaCalendarAlt className="me-2" /> Date of Birth</h5>
                  <p>{new Date(teacher.dob).toLocaleDateString()}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 style={{ color: "#6a11cb" }}><FaLock className="me-2" /> Verified</h5>
                  <p>{teacher.isVerified ? "Yes" : "No"}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="mb-3">
                  <h5 style={{ color: "#6a11cb" }}><FaInfoCircle className="me-2" /> Bio</h5>
                  <p>{teacher.bio || "No bio provided"}</p>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <h5 style={{ color: "#6a11cb" }}><FaShareAlt className="me-2" /> Social Media</h5>
                  <div className="social-links d-flex align-items-center">
                    {teacher.socialMedia?.facebook && (
                      <a href={teacher.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="me-3">
                        <FaFacebook size={24} style={{ color: "#3b5998" }} />
                      </a>
                    )}
                    {teacher.socialMedia?.twitter && (
                      <a href={teacher.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="me-3">
                        <FaTwitter size={24} style={{ color: "#1da1f2" }} />
                      </a>
                    )}
                    {teacher.socialMedia?.linkedin && (
                      <a href={teacher.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="me-3">
                        <FaLinkedin size={24} style={{ color: "#0077b5" }} />
                      </a>
                    )}
                    {teacher.socialMedia?.instagram && (
                      <a href={teacher.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="me-3">
                        <FaInstagram size={24} style={{ color: "#e4405f" }} />
                      </a>
                    )}
                    {!teacher.socialMedia?.facebook &&
                      !teacher.socialMedia?.twitter &&
                      !teacher.socialMedia?.linkedin &&
                      !teacher.socialMedia?.instagram && (
                        <p>No social media links provided</p>
                      )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherProfile;