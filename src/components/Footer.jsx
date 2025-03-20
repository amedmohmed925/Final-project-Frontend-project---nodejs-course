import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from './Logo';
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section">
    <Container>
      <Row className="align-items-center justify-content-between">
        <Col xs={12} md={4} className="text-center text-md-start mb-4 mb-md-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo /> {/* كومبوننت اللوجو */}
            <p className="footer-text mt-3">
              Empowering learners worldwide with top-quality education since 2020.
            </p>
          </motion.div>
        </Col>
        <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="footer-heading">Contact Us</h4>
            <p className="footer-text">Email: support@courseplatform.com</p>
            <p className="footer-text">Phone: +1-800-555-1234</p>
            <p className="footer-text">Address: 123 Learning St, Education City</p>
          </motion.div>
        </Col>
        <Col xs={12} md={4} className="text-center text-md-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="social-icon" />
              </a>
            </div>
            <p className="footer-text mt-3">© 2025 Course Platform. All rights reserved.</p>
          </motion.div>
        </Col>
      </Row>
    </Container>
  </footer>
  );
};

export default Footer;