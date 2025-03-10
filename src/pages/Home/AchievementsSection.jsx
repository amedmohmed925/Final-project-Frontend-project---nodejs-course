import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import '../../styles/Achievements.css';

const AchievementsSection = () => {
  const numberAnimation = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  return (
    <section className="achievements-section">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="section-title"
        >
          Our Achievements
          <span>Empowering Education, Transforming Lives</span>
        </motion.h2>
        <Row className="justify-content-center">
          {[
            { number: "500+", text: "Courses Designed for Your Success" },
            { number: "10,000+", text: "Students Thriving Worldwide" },
            { number: "200+", text: "Expert Instructors Leading the Way" },
          ].map((stat, index) => (
            <Col xs={12} md={4} key={index} className="text-center mb-4">
              <motion.div
                className="glass-card"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
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
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default AchievementsSection;