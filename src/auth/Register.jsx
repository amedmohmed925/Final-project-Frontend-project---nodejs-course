import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { verifyOTP, resendOTP } from "../api/authApi";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaCalendar,
  FaUserShield,
  FaSpinner,
} from "react-icons/fa";
import { Form, Button, Row, Col, Modal, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/Register.css";
import Logo from "../components/Logo";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirm_password: "",
    email: "",
    dob: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "username",
      "password",
      "confirm_password",
      "email",
      "dob",
      "role",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);
    if (emptyFields.length > 0) {
      setEmptyFields(emptyFields);
      setError("Please fill all fields");
      setShowModal(true);
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setShowModal(true);
      return false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      setError("Password must contain at least one letter and one number");
      setShowModal(true);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email address");
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingVerify(true);
    try {
      await dispatch(register(formData)).unwrap();
      setError("");
      setShowOtpForm(true);
      setSuccess("Registration successful! Please check your email for OTP.");
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Registration failed");
      setShowModal(true);
    } finally {
      setIsLoadingVerify(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingVerify(true);
    try {
      await verifyOTP(formData.email, otp);
      setSuccess("Account verified successfully! You can now login.");
      setShowModal(true);
      setShowOtpForm(false);
      navigate("/login");
    } catch (err) {
      setError(err.message || "OTP verification failed");
      setShowModal(true);
    } finally {
      setIsLoadingVerify(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoadingResend(true);
    try {
      await resendOTP(formData.email);
      setSuccess("OTP resent successfully! Please check your email.");
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
      setShowModal(true);
    } finally {
      setIsLoadingResend(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="align-items-center justify-content-center min-vh-100">
          <Col xs={12} md={10} lg={8} className="p-4">
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
                  Start Your Journey Today
                </motion.h2>
               
              </div>

              {!showOtpForm ? (
                <Form onSubmit={handleSubmit} className="auth-form">
                  <Row>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaUser className="me-2" /> First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaUser className="me-2" /> Last Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaUser className="me-2" /> Username
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter your username"
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaEnvelope className="me-2" /> Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaCalendar className="me-2" /> Date of Birth
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaUserShield className="me-2" /> Role
                        </Form.Label>
                        <Form.Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          className="rounded-pill"
                        >
                          <option value="">Select Role</option>
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaLock className="me-2" /> Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <FaLock className="me-2" /> Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          required
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex flex-column align-items-center py-3">
                    <Button
                      variant="primary"
                      type="submit"
                      className="auth-button mb-2 rounded-pill"
                      disabled={isLoadingVerify}
                      style={{
                        backgroundColor: "var(--mainColor)",
                        borderColor: "var(--mainColor)",
                        width: "200px",
                      }}
                    >
                      {isLoadingVerify ? <FaSpinner className="spinner" /> : "Register"}
                    </Button>
                    <Link className="text-secondary mb-2 text-decoration-none" to="/login">
                      Already have an account? Log in
                    </Link>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={handleOtpSubmit} className="auth-form">
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                      className="rounded-pill"
                    />
                  </Form.Group>
                  <div className="d-flex flex-column align-items-center">
                    <Button
                      variant="primary"
                      type="submit"
                      className="auth-button mb-2 rounded-pill"
                      disabled={isLoadingVerify}
                      style={{
                        backgroundColor: "#ebd126",
                        borderColor: "#ebd126",
                        width: "200px",
                      }}
                    >
                      {isLoadingVerify ? <FaSpinner className="spinner" /> : "Verify OTP"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-25 mb-2 rounded-pill"
                      onClick={handleResendOtp}
                      disabled={isLoadingResend}
                      style={{ backgroundColor: "var(--mainColor)", borderColor: "var(--mainColor)" }}
                    >
                      {isLoadingResend ? <FaSpinner className="spinner" /> : "Resend OTP"}
                    </Button>
                  </div>
                </Form>
              )}
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

export default Register;