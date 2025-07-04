import { useState, useEffect } from 'react';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { resetPassword } from '../api/authApi';
import '../styles/Register.css'; // استخدام أسلوب التصميم من register.css
import Logo from '../../../shared/components/Logo';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordHint, setPasswordHint] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const email = query.get('email');
  const token = query.get('token');

  useEffect(() => {
    if (!email || !token) {
      setError('Invalid reset link.');
      setShowModal(true);
    }
  }, [email, token]);

  const validatePassword = (password) => {
    // Password: at least 8 chars, includes uppercase, lowercase, number, special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      setShowModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPassword(email, token, newPassword);
      setSuccess(response.message);
      setError('');
      setShowModal(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="align-items-center justify-content-center min-vh-100">
          <Col xs={12} md={8} lg={6} className="p-4">
            <motion.div
              className="form-section card p-4 shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-4 logoAuth text-center">
                <Logo colorText="#0a3e6e" />
                <motion.h2
                  className="fs-4 fw-bold mb-0 mt-3  section-title"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Reset Your Password
                </motion.h2>
               
              </div>
              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>
                    <FaLock className="me-2" /> New Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="rounded-pill"
                    onFocus={() => setPasswordHint("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.")}
                    onBlur={() => setPasswordHint("")}
                  />
                  {passwordHint && (
                    <div style={{
                      position: 'absolute',
                      top: '-48px',
                      left: '0',
                      background: '#fff',
                      color: '#333',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.95em',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      minWidth: '270px',
                      maxWidth: '350px',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '30px',
                        bottom: '-12px',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '12px solid #fff',
                        filter: 'drop-shadow(0 1px 1px #ccc)'
                      }}></span>
                      {passwordHint}
                    </div>
                  )}
                </Form.Group>
                <div className="d-flex flex-column align-items-center py-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="auth-button mb-2 rounded-pill"
                    disabled={isLoading}
                    style={{ backgroundColor: 'var(--mainColor)', borderColor: 'var(--mainColor)', width: '200px' }}
                  >
                    {isLoading ? <FaSpinner className="spinner" /> : 'Reset Password'}
                  </Button>
                </div>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
          }}
        >
          <Modal.Title style={{ color: '#212529' }}>
            {success ? 'Success' : 'Error'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f8f9fa', color: '#212529' }}>
          {success || error}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: 'var(--mainColor)',
              borderColor: 'var(--mainColor)',
              color: '#000',
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResetPassword;