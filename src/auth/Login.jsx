import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../api/authApi";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import { Form, Button, Modal, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Register.css";
import Logo from "../components/Logo";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setError("Username can only contain letters, numbers, and underscores.");
      setShowModal(true);
      return false;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      setShowModal(true);
      return false;
    }

    return true;
  };

  const getCustomErrorMessage = (error) => {
    const apiMessage = error.message;
    const status = error.status;

    if (status === 429) {
      return "You’ve exceeded the login attempts limit. Please wait 10 minutes and try again.";
    }

    switch (apiMessage) {
      case "Invalid credentials":
        return "Username or password is incorrect. Please try again.";
      case "Too many login attempts, please try again after 10 minutes":
        return "You’ve exceeded the login attempts limit. Please wait 10 minutes and try again.";
      case "Account not verified. Please verify your email.":
        return "Your account is not verified yet. Please check your email to verify it.";
      default:
        return apiMessage || "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await dispatch(login(credentials)).unwrap();
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      setSuccess("Login successful! Redirecting...");
      setShowModal(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const customErrorMessage = getCustomErrorMessage(err);
      setError(customErrorMessage);
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
                  className="fs-4 fw-bold mb-0 mt-3 section-title"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome Back to Learning!
                </motion.h2>
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
                    type="submit"
                    className="auth-button mb-2 rounded-pill"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      "Let’s Login"
                    )}
                  </Button>
                  <Link
                    className="text-secondary mb-2 text-decoration-none"
                    to="/forgotPassword"
                  >
                    Forgot your password?
                  </Link>
                  <Link
                    className="text-secondary text-decoration-none"
                    to="/register"
                  >
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
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ color: "#212529" }}>
            {success ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f9fa", color: "#212529" }}>
          {success || error}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "var(--mainColor)",
              borderColor: "var(--mainColor)",
              color: "#000",
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