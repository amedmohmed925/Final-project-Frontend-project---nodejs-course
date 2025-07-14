// src/components/AdminNotificationSender/AdminNotificationSender.jsx
import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { createNotification } from "../api/notificationApi";
import "../styles/AdminNotificationSender.css";
import { FaArrowLeft, FaArrowRight, FaBell, FaUsers, FaChalkboardTeacher, FaUserGraduate, FaBullhorn } from "react-icons/fa";
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

  const getRecipientIcon = () => {
    switch(recipientType) {
      case "all": return <FaUsers />;
      case "teachers": return <FaChalkboardTeacher />;
      case "students": return <FaUserGraduate />;
      case "advertisers": return <FaBullhorn />;
      default: return <FaUsers />;
    }
  };

  return (
    <div className="admin-page-" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        style={{
          position: 'fixed',
          top: '50%',
          left: isSidebarOpen ? '280px' : '20px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        padding: '40px 20px'
      }}>
        <Container className="admin-notification-">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="notification-form-card" style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <div className="text-center mb-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <FaBell />
                    Send Notification
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Send notifications to your platform users
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="recipientType" className="mb-4">
                    <Form.Label className="d-flex align-items-center gap-2">
                      {getRecipientIcon()}
                      Select Recipients
                    </Form.Label>
                    <Form.Select 
                      value={recipientType} 
                      onChange={(e) => setRecipientType(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <option value="all">All Users</option>
                      <option value="teachers">Teachers</option>
                      <option value="students">Students</option>
                      <option value="advertisers">Advertisers</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="title" className="mb-4">
                    <Form.Label>Notification Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Enter notification title"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="message" className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="Enter notification message"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        resize: 'vertical'
                      }}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit"
                    className="w-100"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Send Notification
                  </Button>
                </Form>

                {error && (
                  <Alert variant="danger" className="mt-4" style={{ borderRadius: '10px' }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success" className="mt-4" style={{ borderRadius: '10px' }}>
                    {success}
                  </Alert>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminNotificationSender;