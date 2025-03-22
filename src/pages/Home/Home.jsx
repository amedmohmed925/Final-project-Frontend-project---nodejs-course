import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/Home.css";
import "animate.css";
import FeaturesSection from "./FeaturesSection";
import TeamSection from "./TeamSection";
import Gallery from "./Gallery";
import ImageContentSection from "./ImageContentSection";
import MostViewedCoursesSlider from "../../components/coureses/MostViewedCoursesSlider.jsx";

const Home = () => {
 

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
                    className="hero-title animate__animated animate__bounceInDown animate__delay-1"
                  >
                    Welcome to Our <span className="text-light">EduQuest</span>  Platform
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

      {/* Most Viewed Courses Section */}
      {/* <section className="most-viewed-courses">
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
            {coursesWithDescription.map((course) => (
              <div key={course.title} className="px-2">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <div className="course-card">
                    <div className="course-image">
                      <img
                        src={course.image}
                        alt={course.title}
                        onError={handleImageError}
                      />
                      <div className="course-price">${course.price}</div>
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>
                      <div className="course-details">
                        <span className="course-duration">{course.duration}</span>
                        <span className="course-level">Beginner</span>
                      </div>
                      <button className="btn-custom enroll-btn">Enroll Now</button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </Container>
      </section> */}
<MostViewedCoursesSlider />
      <FeaturesSection />

  
    
      <ImageContentSection />
            {/* <WhyChooseUsSectios /> */}
            <Gallery />
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

      
     
    </div>
  );
};

export default Home;