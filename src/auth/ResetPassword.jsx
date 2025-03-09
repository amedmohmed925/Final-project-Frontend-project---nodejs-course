import { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { resetPassword } from '../api/authApi';
import '../styles/register.css';
import Logo from '../components/Logo';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      setError('Password must be at least 8 characters with a letter and a number.');
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
    <div
      style={{ minHeight: '100vh' }}
      className="auth-container d-flex align-items-center justify-content-center"
    >
      <div className="form-section w-50 h-75 card p-4 animate__animated animate__bounceInDown">
        <div
          className="py-4 logoAuth"
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "20px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Logo colorText="#0a3e6e" />
          <motion.h2
            className="fs-4 fw-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Reset Your Password
          </motion.h2>
          <span
            className="linetUnderTitle"
            style={{
              width: "100px",
              backgroundColor: "#0a3e6e",
              height: "2px",
              border: "none",
            }}
          ></span>
        </div>
        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock /> New Password
            </Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-center align-items-center py-2" style={{ flexDirection: "column" }}>
            <Button
              variant="primary"
              type="submit"
              className="auth-button w-25"
              disabled={isLoading}
              style={{ backgroundColor: '#ebd126', borderColor: '#ebd126' }}
            >
              {isLoading ? <FaSpinner className="spinner" /> : 'Reset Password'}
            </Button>
          </div>
        </Form>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
              backgroundColor: '#ebd126',
              borderColor: '#ebd126',
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