import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons"; // استيراد أيقونة البحث

import "../../styles/Home.css"; // ملف CSS للتنسيق
import "animate.css";
const Home = () => {
  return (
    <>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay">
            <Container>
              <Row className="justify-content-center align-items-center h-100">
                <Col md={8} className="text-center">
              <div className="title-container">
                  <h1 style={{color:"#ebca26"}}  className="hero-title animate__animated animate__bounceInDown animate__delay-1">
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

        {/* Featured Courses Section */}
        <section className="featured-courses">
          <Container>
            <h2 className="section-title">Featured Courses</h2>
            <Row>
              {[1, 2, 3].map((course) => (
                <Col md={4} key={course}>
                  <Card className="course-card">
                    <Card.Img
                      variant="top"
                      src={`https://picsum.photos/300/200?random=${course}`}
                    />
                    <Card.Body>
                      <Card.Title>Course {course}</Card.Title>
                      <Card.Text>
                        This is a brief description of the course.
                      </Card.Text>
                      <Button variant="primary">View Course</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Statistics Section */}
        <section className="statistics-section">
          <Container>
            <h2 className="section-title">Our Achievements</h2>
            <Row>
              <Col md={4} className="text-center">
                <h3 className="statistic-number">500+</h3>
                <p className="statistic-text">Courses</p>
              </Col>
              <Col md={4} className="text-center">
                <h3 className="statistic-number">10,000+</h3>
                <p className="statistic-text">Students</p>
              </Col>
              <Col md={4} className="text-center">
                <h3 className="statistic-number">200+</h3>
                <p className="statistic-text">Instructors</p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <Container>
            <h2 className="section-title">What Our Students Say</h2>
            <Row>
              {[1, 2, 3].map((testimonial) => (
                <Col md={4} key={testimonial}>
                  <Card className="testimonial-card">
                    <Card.Body>
                      <Card.Text>
                        "This platform has transformed my career. Highly
                        recommended!"
                      </Card.Text>
                      <Card.Title>- Student {testimonial}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <Container>
            <h2 className="section-title">Subscribe to Our Newsletter</h2>
            <Form className="newsletter-form">
              <Form.Group controlId="newsletterEmail">
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>
              <Button variant="primary" className="subscribe-button">
                Subscribe
              </Button>
            </Form>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Home;
