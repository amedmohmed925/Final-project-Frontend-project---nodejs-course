import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../courses/api/courseApi';
import { Modal, Button, Table, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import SidebarProfile from '../../user/components/SidebarProfile';

const PendingCourses = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/courses/admin/pending-courses');
        setPendingCourses(response.data);
      } catch {
        setError('Error fetching pending courses.');
      }
      setLoading(false);
    };

    fetchPendingCourses();
  }, []);

  const handleApprove = async (courseId) => {
    try {
      await axiosInstance.put(`/courses/admin/approve-course/${courseId}`);
      setPendingCourses((prev) => prev.filter((course) => course._id !== courseId));
      setShowModal(false);
    } catch {
      setError('Error approving course.');
    }
  };

  const filteredCourses = pendingCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? 'sidebar-open' : ''}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="pending-courses container">
        <h2 className="mb-4">Pending Courses</h2>

        <Form className="mb-3">
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <Form.Control
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={course._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={course.featuredImage}
                      alt={course.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => navigate(`/admin/pending-courses/${course._id}`)}
                  >
                    {course.title}
                  </td>
                  <td>{course.description}</td>
                  <td>{course.price}</td>
                  <td>{course.level}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowModal(true);
                      }}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {selectedCourse && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Approve Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to approve the course {`"${selectedCourse.title}"`}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handleApprove(selectedCourse._id)}>
                Approve
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};

export default PendingCourses;
