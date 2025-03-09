import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../api/authApi';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/register.css'; // تأكدي من أن المسار صحيح
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
                  className="fs-4 fw-bold mt-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome Back to Learning!
                </motion.h2>
                <motion.span
                  className="linetUnderTitle"
                  initial={{ width: '50px' }}
                  whileHover={{ width: '200px' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{
                    backgroundColor: '#0a3e6e',
                    height: '2px',
                    border: 'none',
                    display: 'block',
                    margin: '10px auto',
                  }}
                ></motion.span>
              </div>
              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>
                    <FaUser className="me-2" /> Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    className="rounded-pill"
                  />
                </Form.Group>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>
                    <FaLock className="me-2" /> Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="rounded-pill"
                  />
                </Form.Group>
                <div className="d-flex flex-column align-items-center py-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="auth-button mb-2 rounded-pill"
                    disabled={isLoading}
                    style={{ backgroundColor: '#ebd126', borderColor: '#ebd126', width: '200px' }}
                  >
                    {isLoading ? <FaSpinner className="spinner" /> : 'Let’s Login'}
                  </Button>
                  <Link className="text-secondary mb-2 text-decoration-none" to="/forgotPassword">
                    Forgot your password?
                  </Link>
                  <Link className="text-secondary text-decoration-none" to="/register">
                    Don't have an account? Register
                  </Link>
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

export default Login;