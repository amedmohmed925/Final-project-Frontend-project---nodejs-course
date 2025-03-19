import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "../../styles/WhyChooseUsSection.css";

const WhyChooseUsSection = () => {
  const fallbackImage = "https://via.placeholder.com/500x500.png?text=Image+Not+Found";

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <>
      {/* تعريف الشكل البيضاوي المتعرج باستخدام SVG */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <clipPath id="wavy-ellipse">
            {/* تم تكبير المسار هنا */}
            <path d="M0,0 C200,0 400,50 400,100 C400,150 200,200 0,200 C-200,200 -400,150 -400,100 C-400,50 -200,0 0,0 Z M0,20 C180,20 380,60 380,100 C380,140 180,180 0,180 C-180,180 -380,140 -380,100 C-380,60 -180,20 0,20 Z" />
          </clipPath>
        </defs>
      </svg>
      <section className="why-choose-us-section">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} className="mb-4 mb-md-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="feature-item">
                  <span className="feature-number">01</span>
                  <div>
                    <h3 className="feature-title">Expert Instructors</h3>
                    <p className="feature-description">
                      Learn from industry experts with years of experience in their fields.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-number">02</span>
                  <div>
                    <h3 className="feature-title">Flexible Learning</h3>
                    <p className="feature-description">
                      Study at your own pace with our flexible schedules and online courses.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-number">03</span>
                  <div>
                    <h3 className="feature-title">Certified Courses</h3>
                    <p className="feature-description">
                      Earn globally recognized certificates upon course completion.
                    </p>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button variant="primary" className="cta-button">
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
            </Col>
            <Col xs={12} md={4} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="student-image-container"
              >
                <div className="wavy-background"></div>
                <img
                  src="public/student.png" // صورة بأبعاد أطول لإظهار الجزء السفلي
                  alt="Student"
                  className="student-image"
                  onError={handleImageError}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default WhyChooseUsSection;