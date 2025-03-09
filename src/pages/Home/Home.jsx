import { Container, Row, Col, Button, Form, Card, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import Slider from "react-slick"; // استيراد السلايدر
import "slick-carousel/slick/slick.css"; // تنسيق السلايدر
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Home.css";
import "animate.css";

const Home = () => {
  // إعدادات السلايدر
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="home-page">
      {/* Hero Section - بدون تغيير */}
      <section className="hero-section">
        <div className="hero-overlay">
          <Container>
            <Row className="justify-content-center align-items-center h-100">
              <Col md={8} className="text-center">
                <div className="title-container">
                  <h1
                    style={{ color: "#ebca26" }}
                    className="hero-title animate__animated animate__bounceInDown animate__delay-1"
                  >
                    Welcome to Our Courses Platform
                  </h1>
                </div>
                <p className="hero-subtitle animate__animated animate__bounceIn animate__delay-3">
                  Learn from the best instructors and enhance your skills.
                </p>
                <Form className="search-form animate__animated animate__bounceInUp animate__delay-2">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search for a course..."
                      className="search-input"
                    />
                    <Button className="search-button">
                      <Search />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Most Viewed Courses Section - مع سلايدر */}
      <section className="most-viewed-courses">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Most Viewed Courses
          </motion.h2>
          <Slider {...sliderSettings}>
            {[1, 2, 3, 4, 5].map((course) => (
              <div key={course} className="px-2">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Card className="course-card">
                    <Card.Img
                      variant="top"
                      src={`https://picsum.photos/300/200?random=${course}`}
                    />
                    <Card.Body>
                      <Card.Title>Course {course}</Card.Title>
                      <Card.Text>
                        Join thousands of learners in this top-rated course.
                      </Card.Text>
                      <Button variant="primary">Enroll Now</Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Slider>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Why Choose Us?
          </motion.h2>
          <Row>
            {[
              { title: "Expert Instructors", text: "Learn from industry leaders.", img: "https://picsum.photos/100/100?random=1" },
              { title: "Flexible Learning", text: "Study at your own pace.", img: "https://picsum.photos/100/100?random=2" },
              { title: "Certified Courses", text: "Earn recognized certificates.", img: "https://picsum.photos/100/100?random=3" },
            ].map((item, index) => (
              <Col md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="why-card"
                >
                  <img src={item.img} alt={item.title} className="why-img" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Statistics Section - مع أنيميشن مستمر */}
      <section className="statistics-section">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Our Achievements
          </motion.h2>
          <Row>
            {[
              { number: "500+", text: "Courses" },
              { number: "10,000+", text: "Students" },
              { number: "200+", text: "Instructors" },
            ].map((stat, index) => (
              <Col md={4} key={index} className="text-center">
                <motion.h3
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: index * 0.3, repeat: Infinity, repeatType: "reverse" }}
                  className="statistic-number"
                >
                  {stat.number}
                </motion.h3>
                <p className="statistic-text">{stat.text}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            What Our Students Say
          </motion.h2>
          <Row>
            {[1, 2, 3].map((testimonial) => (
              <Col md={4} key={testimonial}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: testimonial * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="testimonial-card">
                    <Card.Body>
                      <Card.Text>
                        "This course changed my life. The instructors are amazing!"
                      </Card.Text>
                      <Card.Title>- Student {testimonial}</Card.Title>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="blog-section">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Latest Blog Posts
          </motion.h2>
          <Row>
            {[1, 2, 3].map((post) => (
              <Col md={4} key={post}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: post * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="blog-card">
                    <Card.Img
                      variant="top"
                      src={`https://picsum.photos/300/200?random=${post + 5}`}
                    />
                    <Card.Body>
                      <Card.Title>Blog Post {post}</Card.Title>
                      <Card.Text>
                        A sneak peek into the latest trends in learning.
                      </Card.Text>
                      <Button variant="outline-primary">Read More</Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Stay Updated
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Form className="newsletter-form">
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <Button variant="primary" className="subscribe-button">
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Home;