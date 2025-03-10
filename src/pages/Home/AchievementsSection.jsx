import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../../styles/Achievements.css';

const AchievementsSection = () => {
  const numberAnimation = {
    animate: {
      scale: [1, 1.2, 1],
      color: ['#fbbf24', '#f59e0b', '#fbbf24'],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, delay: i * 0.3, ease: 'backOut' },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="achievements-section">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="section-title"
        >
          Our Achievements
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="subtitle"
          >
            Empowering Education, Transforming Lives
          </motion.span>
        </motion.h2>
        <motion.div
          className="achievements-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { number: "500+", text: "Courses Designed for Your Success" },
            { number: "10,000+", text: "Students Thriving Worldwide" },
            { number: "200+", text: "Expert Instructors Leading the Way" },
            { number: "50+", text: "Industry Certifications Offered" }, // إضافة إنجاز جديد
          ].map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              className="achievement-card"
              variants={cardVariants}
              whileHover={{ scale: 1.05, rotate: 2, zIndex: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3
                className="statistic-number"
                variants={numberAnimation}
                animate="animate"
              >
                {stat.number}
              </motion.h3>
              <p className="statistic-text">{stat.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default AchievementsSection;