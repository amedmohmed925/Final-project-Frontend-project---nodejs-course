import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import { forgetPassword } from '../api/authApi'; // استيراد فانكشن الـ API
import '../styles/register.css'; // نفس الـ CSS بتاع الـ Login
import Logo from '../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const response = await forgetPassword(email);
      setSuccess(response.message);
      setError('');
      setShowModal(true);
      setTimeout(() => navigate('/login'), 3000); // إرجاع لصفحة الـ Login بعد 3 ثواني
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
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
            Forgot Your Password?
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
              <FaEnvelope /> Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              {isLoading ? <FaSpinner className="spinner" /> : 'Send Reset Link'}
            </Button>
            <Link className="text-secondary" to="/login">
              Back to Login
            </Link>
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

export default ForgotPassword;