import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../../styles/TeamSection.css'; // ملف الـ CSS للتنسيق

const TeamSection = () => {
  // قائمة بصور الأشخاص (روابط من Unsplash)
  const teamMembers = [
    { id: 1, image: 'https://i.pinimg.com/736x/c8/dc/3c/c8dc3c28012d7f7d8b90d8138ff9bbbd.jpg' }, // رجل
    { id: 2, image: 'https://i.pinimg.com/736x/ce/76/b2/ce76b20f89a9a46e372cb6d6b612eb90.jpg' }, // رجل
    { id: 3, image: 'https://i.pinimg.com/736x/32/f5/25/32f525caa37da0ae0145b70b4a592485.jpg' }, // رجل
    { id: 4, image: 'https://i.pinimg.com/736x/0d/00/fa/0d00faf7e0a04fe724ecd886df774e4c.jpg' }, // رجل
    { id: 5, image: 'https://i.pinimg.com/736x/91/b5/80/91b5808af306e2ee0995dcb492de5ceb.jpg' }, // رجل
    { id: 6, image: 'https://img.freepik.com/premium-photo/smiling-male-teacher-class-with-students-background_268722-7336.jpg' }, // رجل
    { id: 7, image: 'https://i.pinimg.com/736x/84/8f/3b/848f3b92a3e2a6040faccad5888f851e.jpg' }, // رجل
    { id: 8, image: 'https://i.pinimg.com/736x/5f/8d/81/5f8d81d122c527564cbfe787694f9203.jpg' }, // رجل
    { id: 9, image: 'https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg' }, // رجل
  ];

  // نسخ الصور لتكرارها للحركة المستمرة
  const extendedTeamMembers = [...teamMembers, ...teamMembers];

  return (
    <section className="team-section">
      <Container>
      <div className="text-center mb-5 scroll-animation visible">
      <h2 className="fw-bold mb-3"> Our Team</h2>
      <p className="lead text-muted mx-auto" style={{ maxWidth: 700 }}>
        We're dedicated to providing a personalized learning experience that
        helps you achieve your goals.
      </p>
    </div>
        
        <Row className="align-items-center">
          <Col xs={12} md={6} className="team-slider-container">
            <div className="team-slider-wrapper">
              <motion.div
                className="team-slider"
                animate={{
                  y: ['0%', '-50%'], 
                }}
                transition={{
                  y: {
                    repeat: Infinity, 
                    repeatType: 'loop',
                    duration: 20,
                    ease: 'linear',
                  },
                }}
              >
                {extendedTeamMembers.map((member, index) => (
                  <motion.div
                    key={`${member.id}-${index}`} 
                    className={`team-member ${index % 3 === 1 ? 'middle' : ''}`}
                    whileHover={{ scale: 1.05 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <img src={member.image} alt={`Team Member ${member.id}`} className="team-image" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Col>
          <Col xs={12} md={6} className="team-content">
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="content-title"
            >
              Meet Our Instructors
            </motion.h3>
            <p className="content-text">
              Our team of instructors are highly skilled professionals with years of experience in their fields. They bring creativity, innovation, and expertise to every course, ensuring you receive the best learning experience possible. From cutting-edge technology to inspiring leadership, our instructors are dedicated to empowering you with knowledge and skills that transform your career.
            </p>
            <ul className="content-list">
              <li>Over 10+ years of industry experience.</li>
              <li>Creative and innovative teaching methods.</li>
              <li>Certified experts in their domains.</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TeamSection;