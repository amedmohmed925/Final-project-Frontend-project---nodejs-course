import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../api/authApi";
import { FaUser, FaLock, FaSpinner, FaGoogle, FaFacebookF, FaTwitter, FaGithub, FaApple } from "react-icons/fa";
import { Form, Button, Modal, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Register.css";
import "../styles/SocialLogin.css";

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
  const [socialLoading, setSocialLoading] = useState("");
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
      setError("Password must be at least 8 characters long and include a letter and a number.");
      setShowModal(true);
      return false;
    }
    return true;
  };
  
  const getCustomErrorMessage = (error) => {
    const status = error.status;
    const apiMessage = error.message;

    if (status >= 500) {
      return "A server error occurred. We are working on fixing it, please try again later.";
    }
    if (status === 401 || status === 403) {
      return "Incorrect username or password. Please check your credentials and try again.";
    }
    if (status === 429) {
      return "You have made too many login attempts. Please wait a few minutes and try again.";
    }
    if (apiMessage === "Account not verified. Please verify your email.") {
        return "Your account has not been verified. Please check your email for a verification link.";
    }
    return "An unexpected error occurred. Please try again.";
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

  // =================== بداية الدالة المعدلة ===================
  // تم إفراغ هذه الدالة لجعل الأيقونات شكلًا فقط بدون وظيفة
  const handleSocialLogin = async (provider) => {
    // لا تفعل شيئًا عند الضغط. الأيقونات شكل فقط في الوقت الحالي.
    // يمكنك إضافة رسالة في الكونسول لتذكيرك بأنها غير مفعلة
    console.log(`Social login with ${provider} is not implemented yet.`);
  };
  // =================== نهاية الدالة المعدلة ===================

  const socialProviders = [
    { name: "Google", icon: FaGoogle, className: "google-btn" },
    { name: "Facebook", icon: FaFacebookF, className: "facebook-btn" },
    { name: "Twitter", icon: FaTwitter, className: "twitter-btn" },
    { name: "GitHub", icon: FaGithub, className: "github-btn" },
    { name: "Apple", icon: FaApple, className: "apple-btn" }
  ];

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
                  <Form.Label><FaUser className="me-2" /> Username</Form.Label>
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
                  <Form.Label><FaLock className="me-2" /> Password</Form.Label>
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
                    disabled={isLoading || socialLoading}
                  >
                    {isLoading ? <FaSpinner className="spinner" /> : "Let's Login"}
                  </Button>
                  <Link className="text-secondary mb-2 text-decoration-none" to="/forgotPassword">
                    Forgot your password?
                  </Link>
                  <Link className="text-secondary text-decoration-none" to="/register">
                    Don't have an account? Register
                  </Link>
                  <div className="social-login-section mt-4">
                    <div className="divider-container">
                      <div className="divider">
                        <span className="divider-text">Or log in with</span>
                      </div>
                    </div>
                    <div className="social-buttons-container">
                      {socialProviders.map((provider, index) => (
                        <motion.button
                          key={provider.name}
                          type="button"
                          className={`social-btn ${provider.className}`}
                          onClick={() => handleSocialLogin(provider.name)}
                          disabled={isLoading} // تمت إزالة socialLoading من هنا لأنه لم يعد مستخدمًا
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Login with ${provider.name}`}
                        >
                          {/* بما أن socialLoading لن يتم تفعيله، لن يظهر Spinner هنا أبدًا */}
                          <provider.icon className="social-icon" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
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