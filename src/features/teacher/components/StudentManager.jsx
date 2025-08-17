import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getStudents, removeStudent } from "../api/teacherApi";
import { fetchStudentProgress } from "../../student/api/studentProgressApi";
import { Modal, Button, Spinner, Table, Badge, ListGroup, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const StudentManager = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const courseId = query.get("courseId");
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      getStudents(courseId)
        .then((res) => setStudents(res.data))
        .catch(() => setError("Failed to fetch students."))
        .finally(() => setLoading(false));
    }
  }, [courseId]);

  const handleRemove = (student) => {
    setStudentToRemove(student);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (!studentToRemove) return;
    setLoading(true);
    setError("");
    try {
      await removeStudent(courseId, studentToRemove.studentId);
      setStudents((prev) => prev.filter((s) => s.studentId !== studentToRemove.studentId));
      setShowRemoveModal(false);
    } catch {
      setError("Failed to remove student.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgress = async (student) => {
    setProgressLoading(true);
    setProgressError("");
    setShowProgressModal(true);
    try {
      const data = await fetchStudentProgress();
      setProgressData(data);
    } catch {
      setProgressError("Failed to fetch progress.");
    } finally {
      setProgressLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
            >
              {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
            </button> 
    <div style={{minHeight:"80vh"}} className="container my-4">
      <div className="py-4  text-center">
                              <motion.h2
                                className="fs-3 fw-bold mb-0 mt-3 section-title"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                             Manager Your Students
                              </motion.h2>
                            </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped hover responsive className="shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Picture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <img
                      src={student.profilePicture || "/placeholder.jpg"}
                      alt="Profile"
                      className="img-thumbnail rounded-circle"
                      width="40"
                      height="40"
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mx-1"
                      onClick={() => handleViewProgress(student)}
                    >
                      View Progress
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="mx-1"
                      onClick={() => handleRemove(student)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Remove Student Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove {studentToRemove?.name} from this course?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Progress Modal */}
      <Modal show={showProgressModal} onHide={() => setShowProgressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Student Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {progressLoading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          ) : progressError ? (
            <Alert variant="danger">{progressError}</Alert>
          ) : progressData ? (
            <>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={progressData.profilePicture || "/placeholder.jpg"}
                  alt="Profile"
                  className="img-thumbnail rounded-circle me-3"
                  width="60"
                  height="60"
                />
                <div>
                  <h5 className="mb-0">{progressData.name}</h5>
                  <Badge bg={progressData.certificateStatus ? "success" : "secondary"}>
                    {progressData.certificateStatus || "No Certificate"}
                  </Badge>
                </div>
              </div>
              <div className="mb-3">
                <label className="fw-bold">Progress:</label>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${progressData.progressPercentage}%` }}
                    aria-valuenow={progressData.progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progressData.progressPercentage}%
                  </div>
                </div>
              </div>
              <div>
                <label className="fw-bold">Completed Lessons:</label>
                <ListGroup>
                  {Array.isArray(progressData.completedLessons) && progressData.completedLessons.length > 0 ? (
                    progressData.completedLessons.map((lesson) => (
                      <ListGroup.Item
                        key={lesson.lessonId}
                        variant={lesson.completed ? "success" : ""}
                        className={lesson.completed ? "list-group-item-success" : ""}
                      >
                        {lesson.title}
                        {lesson.completed && (
                          <Badge bg="success" className="ms-2">
                            Completed
                          </Badge>
                        )}
                      </ListGroup.Item>
                    ))
                  ) : (
                    <div className="text-muted">No completed lessons.</div>
                  )}
                </ListGroup>
              </div>
            </>
          ) : (
            <div className="text-muted">No data available.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgressModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default StudentManager;
