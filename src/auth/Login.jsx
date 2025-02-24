// Login.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../api/authApi";
import { FaUser, FaLock } from "react-icons/fa";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/register.css";
import ImageAuth from "./ImageAuth";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(credentials)).unwrap();
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-container d-flex">
      <div className="image-section">
        <ImageAuth />
      </div>
      <div className="form-section">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>Login</motion.h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="mb-3">
            <Form.Label><FaUser /> Username</Form.Label>
            <Form.Control type="text" name="username" value={credentials.username} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><FaLock /> Password</Form.Label>
            <Form.Control type="password" name="password" value={credentials.password} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="auth-button">Login</Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;