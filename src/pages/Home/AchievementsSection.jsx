import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './AchievementsSection.css'; // تأكد من إضافة ملف CSS الخاص بالتصميم

const AchievementsSection = () => {
  const numberAnimation = {
    animate: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: 'easeOut' },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const achievements = [
    { number: '500+', text: 'Courses Designed for Your Success' },
    { number: '10,000+', text: 'Students Thriving Worldwide' },
    { number: '200+', text: 'Expert Instructors Leading the Way' },
    { number: '50+', text: 'Industry Certifications Offered' },
  ];

  return (
    <section className="achievements-section">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="section-title"
        >
          Our Achievements
          <span
           
            className="subtitle text-light"
          >
            Empowering Education, Transforming Lives
          </span>
        </motion.h2>
        <motion.div
          className="achievements-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {achievements.map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              className="achievement-card"
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
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