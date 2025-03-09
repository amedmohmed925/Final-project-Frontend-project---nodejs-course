
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../api/authApi';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/register.css';
import Logo from '../components/Logo';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { username, password } = credentials;

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      setShowModal(true);
      return false;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setError('Password must contain at least one letter and one number.');
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await dispatch(login(credentials)).unwrap();
      setError('');
      setSuccess('Login successful! Redirecting...');
      setShowModal(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'Login failed');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }} className="auth-container d-flex align-items-center justify-content-center">
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
            Welcome Back to Learning!
          </motion.h2>
          <span
          className='linetUnderTitle'
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
              <FaUser /> Username
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock /> Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="auth-button w-100"
            disabled={isLoading}
            style={{ backgroundColor: '#ebd126', borderColor: '#ebd126' }}
          >
            {isLoading ? <FaSpinner className="spinner" /> : 'Login'}
          </Button>
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

export default Login;