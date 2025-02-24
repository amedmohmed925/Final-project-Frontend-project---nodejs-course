import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../api/authApi";
import { FaUser, FaLock, FaEnvelope, FaCalendar, FaUserShield } from "react-icons/fa";
import { Form, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/register.css";
import ImageAuth from "./ImageAuth";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "", confirm_password: "", email: "", dob: "", role: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.role) {
      setError("Please select a role");
      return;
    }
    try {
      await dispatch(register(formData)).unwrap();
      setError("");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container align-items-center d-flex al vh-100">
      <div className="image-section w-50 d-none d-md-block">
        <ImageAuth />
      </div>
      <div className="form-section w-50 d-flex text-light align-items-center justify-content-center">
        <div className="w-75">
          <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>Register</motion.h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="mb-3">
              <Form.Label><FaUser /> Username</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><FaEnvelope /> Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><FaCalendar /> Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><FaLock /> Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><FaLock /> Confirm Password</Form.Label>
              <Form.Control type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><FaUserShield /> Role</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="auth-button w-100">Register</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
