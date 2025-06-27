import { useState, useEffect } from "react";
import { listCourseFeedbacks, replyToFeedback, toggleFeedbackVisibility } from "../api/teacherApi";
import { getCoursesByTeacher } from "../../courses/api/courseApi";
import { useSelector } from "react-redux";
import { Button, Form, Modal, Table, Spinner, Alert } from "react-bootstrap";
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const FeedbackManager = () => {
  const { user } = useSelector((state) => state.user);
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [reply, setReply] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // جلب كورسات المعلم عند تحميل الصفحة
    const fetchCourses = async () => {
      if (!user?._id) return;
      try {
        const res = await getCoursesByTeacher(user._id);
        // دعم كل من res.courses أو res مباشرة كمصفوفة
        const coursesArr = Array.isArray(res.courses)
          ? res.courses
          : Array.isArray(res)
          ? res
          : [];
        setCourses(coursesArr);
        console.log("Courses fetched:", coursesArr);
      } catch (err) {
        setError("Error fetching your courses");
      }
    };
    fetchCourses();
  }, [user]);

  const fetchFeedbacks = async (e) => {
    e && e.preventDefault();
    if (!courseId) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await listCourseFeedbacks(courseId);
      // دعم كل من res.data.feedbacks أو res.data أو res مباشرة كمصفوفة
      const feedbackArr = Array.isArray(res.data?.feedbacks)
        ? res.data.feedbacks
        : Array.isArray(res.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setFeedbacks(feedbackArr);
      console.log("Feedbacks fetched:", feedbackArr);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReply("");
    setModalShow(true);
  };

  const submitReply = async () => {
    if (!reply.trim()) return;
    setActionLoading(true);
    try {
      await replyToFeedback(selectedFeedback._id, reply);
      setSuccessMsg("Reply sent successfully.");
      setModalShow(false);
      setFeedbacks((prev) => prev.map(f => f._id === selectedFeedback._id ? { ...f, reply } : f));
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reply");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVisibility = async (feedbackId) => {
    setActionLoading(true);
    setError("");
    try {
      await toggleFeedbackVisibility(feedbackId);
      setFeedbacks((prev) => prev.map(f => f._id === feedbackId ? { ...f, visible: !f.visible } : f));
    } catch (err) {
      setError(err.response?.data?.message || "Error toggling visibility");
    } finally {
      setActionLoading(false);
    }
  }; 
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <>
    
              <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
     <button
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
         >
           {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
         </button>
    <div style={{minHeight:"80vh"}} className="container py-4">
 <div className="py-4  text-center">
                        <motion.h2
                          className="fs-3 fw-bold mb-0 mt-3 section-title"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                         Course Feedbacks
                        </motion.h2>
                      </div>
      <Form onSubmit={fetchFeedbacks} className="mb-3 d-flex gap-2 align-items-center">
        <Form.Select
          value={courseId}
          onChange={e => { setCourseId(e.target.value); setFeedbacks([]); }}
          required
          style={{ maxWidth: 300 }}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.title || `Course (${course._id})`}
            </option>
          ))}
        </Form.Select>
        <Button type="submit" disabled={loading || !courseId}>
          {loading ? <Spinner size="sm" /> : "Fetch Feedbacks"}
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Student</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Reply</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length === 0 && !loading && (
            <tr><td colSpan={6} className="text-center">No feedbacks found.</td></tr>
          )}
          {feedbacks.map(fb => (
            <tr style={{height:"30px"}} key={fb._id}>
              <td>{

                fb.student?.name ||
                (fb.userId && (fb.userId.firstName || fb.userId.lastName)
                  ? `${fb.userId.firstName || ''} ${fb.userId.lastName || ''}`.trim()
                  : fb.studentId || "-")
              }</td>
              <td>{fb.rating}</td>
              <td>{fb.comment}</td>
              <td>{fb.reply || <span className="text-muted">No reply</span>}</td>
              <td>
                {fb.visible ? (
                  <span className="text-success fw-bold">Visible </span>
                ) : (
                  <span className="text-danger fw-bold">Hidden </span>
                )}
              </td>
              <td  className="d-flex gap-2 align-items-center">
                <Button size="sm" variant="primary" className="me-2" onClick={() => handleReply(fb)} disabled={actionLoading}>
                  Reply
                </Button>
                <Button size="sm" variant={fb.visible ? "warning" : "success"} onClick={() => handleToggleVisibility(fb._id)} disabled={actionLoading}>
                  {fb.visible ? "Hide" : "Show"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reply</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Enter your reply..."
              disabled={actionLoading}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitReply} disabled={actionLoading || !reply.trim()}>
            {actionLoading ? <Spinner size="sm" /> : "Send Reply"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default FeedbackManager;
