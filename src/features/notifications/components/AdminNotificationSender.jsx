// src/components/AdminNotificationSender/AdminNotificationSender.jsx
import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { createNotification } from "../api/notificationApi";
import "../styles/AdminNotificationSender.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SidebarProfile from "../../user/components/SidebarProfile";

const AdminNotificationSender = () => {
  const { user } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "admin") {
      setError("Only admins can send notifications");
      return;
    }

    try {
      await createNotification({ title, message, recipientType });
      setSuccess("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setError(null);
    } catch (err) {
      setError("Failed to send notification");
      setSuccess(null);
    }
  };

  return (
    <div>
  <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    <Container className="admin-notification-sender">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Send Notification</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter notification title"
              />
            </Form.Group>

            <Form.Group controlId="message" className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Enter notification message"
              />
            </Form.Group>

            <Form.Group controlId="recipientType" className="mb-3">
              <Form.Label>Recipient Type</Form.Label>
              <Form.Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                <option value="all">All Users</option>
                <option value="teachers">Teachers</option>
                <option value="students">Students</option>
                <option value="advertisers">Advertisers</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Send Notification
            </Button>
          </Form>
          {error && <p className="text-danger mt-3">{error}</p>}
          {success && <p className="text-success mt-3">{success}</p>}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default AdminNotificationSender;