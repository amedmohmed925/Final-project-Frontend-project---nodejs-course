import { Container, Row, Col, Button, Form, Card, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Home.css";
import "animate.css";
import Logo from "../../components/Logo";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import FeaturesSection from "./FeaturesSection";
import AchievementsSection from "./AchievementsSection";
import TeamSection from "./TeamSection";

const Home = () => {
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const reviewSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const reviews = [
    {
      name: "Samir Ahmed",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "This course has been a game-changer for me. The instructors are highly knowledgeable!",
      rating: 5,
    },
    {
      name: "Lina Hassan",
      image: "https://courssat.com/assets/images/home/female.png",
      review: "Amazing experience! I learned so much and the flexibility was perfect for my schedule.",
      rating: 4,
    },
    {
      name: "Omar Khaled",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Ahmed Khaled",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Lina Hassan",
      image: "https://courssat.com/assets/images/home/female.png",
      review: "Amazing experience! I learned so much and the flexibility was perfect for my schedule.",
      rating: 4,
    },
    {
      name: "Mohamed Ali",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Hassan Mohamed",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Lina Hassan",
      image: "https://courssat.com/assets/images/home/female.png",
      review: "Amazing experience! I learned so much and the flexibility was perfect for my schedule.",
      rating: 4,
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <Container>
            <Row className="justify-content-center align-items-center min-vh-100">
              <Col xs={12} md={8} className="text-center">
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

<TeamSection />
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
                    <Card.Img variant="top" src={`https://picsum.photos/300/200?random=${course}`} />
                    <Card.Body>
                      <Card.Title>Course {course}</Card.Title>
                      <Card.Text>Join thousands of learners in this top-rated course.</Card.Text>
                      <Button variant="primary">Enroll Now</Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Slider>
        </Container>
      </section>
      <FeaturesSection />

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
          <Row className="justify-content-center">
            {[
              { title: "Expert Instructors", text: "Learn from industry leaders.", img: "https://picsum.photos/100/100?random=1" },
              { title: "Flexible Learning", text: "Study at your own pace.", img: "https://picsum.photos/100/100?random=2" },
              { title: "Certified Courses", text: "Earn recognized certificates.", img: "https://picsum.photos/100/100?random=3" },
            ].map((item, index) => (
              <Col xs={12} md={4} key={index} className="mb-4">
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

      {/* Statistics Section */}
<AchievementsSection />
      <section className="image-content-section">
        <Container>
          <Row className="align-items-center flex-column-reverse flex-md-row">
            <Col xs={12} md={6} className="mb-4 mb-md-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                  alt="Learning Environment"
                  className="content-image"
                />
              </motion.div>
            </Col>
            <Col xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="section-title">Why Learn With Us?</h2>
                <p className="section-text">
                  Our platform offers the best learning experience with expert instructors, flexible schedules, and certified courses.
                </p>
                <ul className="section-list">
                  <li>Expert Instructors</li>
                  <li>Flexible Learning</li>
                  <li>Certified Courses</li>
                </ul>
                <Button variant="primary" className="cta-button">
                  Explore Courses
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Student Reviews Section */}
      <section className="student-reviews-section">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-title"
          >
            Student Reviews
            <h4 className="text-light">Inspiring success stories</h4>
          </motion.h2>
          <Slider {...reviewSliderSettings}>
            {reviews.map((review, index) => (
              <div key={index} className="review-slide px-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="review-card"
                >
                  <div className="review-header">
                    <img src={review.image} alt={review.name} className="review-image" />
                    <h3 className="review-name">{review.name}</h3>
                  </div>
                  <p className="review-text">{review.review}</p>
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="rating-heart">❤️</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </Container>
      </section>

      {/* Image Background Section */}
      <section className="image-background-section">
        <div className="image-overlay">
          <Container>
            <Row className="justify-content-center align-items-center min-vh-70">
              <Col xs={12} md={8} className="text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="section-title"
                >
                  Transform Your Skills
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="section-subtitle"
                >
                  Join thousands of learners and start your journey with our expert-led courses today.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link to={'/register'} variant="primary" className="cta-button">
                    Get Started
                  </Link >
                </motion.div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Image Content Section */}
    

 

      {/* Newsletter Section */}
    {/* Footer Section */}
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
                <p className="footer-text mt-3">&copy; 2025 Course Platform. All rights reserved.</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;