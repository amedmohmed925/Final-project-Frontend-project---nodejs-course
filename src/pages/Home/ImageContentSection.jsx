import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "../../styles/ImageContentSection.css";

const ImageContentSection = () => {
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/600x400.png?text=Image+Not+Found";
  };

  return (
    <section className="image-content-section">
      <div className="section-background">
        <div className="wavy-overlay"></div>
      </div>
      <Container style={{zIndex:"6", position:"relative"}}>
        <Row className="align-items-center flex-column-reverse flex-md-row">
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="image-container"
            >
              <img
                src="public\Best-online-course-platforms.webp"
                alt="Learning Environment"
                className="content-image"
                onError={handleImageError}
              />
              <div className="image-overlay">
                <motion.div
                  className="image-overlay-text"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Discover Our Learning Environment
                </motion.div>
              </div>
            </motion.div>
          </Col>
          <Col xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="section-title">Why Learn With Us?</h2>
              <p className="section-text">
                Our platform offers the best learning experience with expert
                instructors, flexible schedules, and certified courses designed
                to help you succeed.
              </p>
              <ul className="section-list">
                <li>
                  <span className="list-icon">✔</span> Expert Instructors
                </li>
                <li>
                  <span className="list-icon">✔</span> Flexible Learning
                </li>
                <li>
                  <span className="list-icon">✔</span> Certified Courses
                </li>
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="primary" className="cta-button">
                  Explore Courses
                </Button>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ImageContentSection;