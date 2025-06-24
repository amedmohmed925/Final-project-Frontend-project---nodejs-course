import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../user/api/userApi"; // Assuming this API exists
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaGraduationCap, FaUniversity, FaBook, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "../styles/TeacherProfile.css"; // Create this CSS file for styling

const TeacherProfile = () => {
  const { teacherId } = useParams(); // Get teacher ID from URL
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teacherData = await getUserById(teacherId); // Fetch teacher data
        setTeacher(teacherData);
      } catch (err) {
        setError(err.message || "Failed to load teacher profile");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

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
                  className="rounded-circle mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h2>{`${teacher.firstName} ${teacher.lastName}`}</h2>
                <p className="text-muted">{teacher.role === "teacher" ? "Instructor" : teacher.role}</p>
              </div>

              <Row>
                <Col md={6} className="mb-3">
                  <h5><FaGraduationCap /> Certificates</h5>
                  <ul>
                    {teacher.certificates && teacher.certificates.length > 0 ? (
                      teacher.certificates.map((cert, index) => <li key={index}>{cert}</li>)
                    ) : (
                      <p>No certificates listed</p>
                    )}
                  </ul>
                </Col>
                <Col md={6} className="mb-3">
                  <h5><FaUniversity /> Education</h5>
                  <p>{teacher.university} ({teacher.graduationYear})</p>
                  <p><FaBook /> Major: {teacher.major}</p>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <h5>Bio</h5>
                  <p>{teacher.bio || "No bio provided"}</p>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <h5>Social Media</h5>
                  <div className="social-links">
                    {teacher.socialMedia?.facebook && (
                      <a href={teacher.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="me-3" size={24} />
                      </a>
                    )}
                    {teacher.socialMedia?.twitter && (
                      <a href={teacher.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="me-3" size={24} />
                      </a>
                    )}
                    {teacher.socialMedia?.linkedin && (
                      <a href={teacher.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="me-3" size={24} />
                      </a>
                    )}
                    {teacher.socialMedia?.instagram && (
                      <a href={teacher.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="me-3" size={24} />
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