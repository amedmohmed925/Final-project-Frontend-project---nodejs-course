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

// بيانات الكورسات مع روابط صور ثابتة من Unsplash
const coursesData = [
  {
    title: "JavaScript Fundamentals",
    category: "Frontend",
    price: 49.99,
    duration: "4 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/435aadaa-8b58-4df2-957e-f1d087693da7_2-%20%D8%A7%D9%84%D8%AF%D9%84%D9%8A%D9%84%20%D8%A7%D9%84%D8%B4%D8%A7%D9%85%D9%84%20%D9%84%D8%AA%D8%B9%D9%84%D9%85%20%D8%A7%D9%84%D8%A8%D8%B1%D9%85%D8%AC%D8%A9%20-%20Python%20Programming.jpg",
  },
  {
    title: "React for Beginners",
    category: "Frontend",
    price: 59.99,
    duration: "6 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/6a7342d4-f6d2-4830-b08b-4a741e483537_1f3c1225-1895-408e-8083-543b018e4ee8.jpg",
  },
  {
    title: "Advanced Node.js",
    category: "Backend",
    price: 69.99,
    duration: "8 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/756ee1d8-822a-4548-a89c-1dbfbe5f8a1f_Untitled%20design.png",
  },
  {
    title: "Full-Stack Web Development",
    category: "Full-Stack",
    price: 99.99,
    duration: "12 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/a9d9bfa9-580b-4c65-aeaf-d49931cee9ab_Untitled%20design.png",
  },
  {
    title: "Python for Data Science",
    category: "AI",
    price: 79.99,
    duration: "10 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/1d8f8f80-cc23-4d0b-8a8b-89f4721bbfbf_Untitled%20design.png",
  },
  {
    title: "Machine Learning with TensorFlow",
    category: "AI",
    price: 89.99,
    duration: "10 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/ec3717a6-a9d2-4c56-a8f8-5ea683993564_%D8%A7%D9%84%D9%88%D8%A7%D9%8A%D8%AA%20%D8%A8%D9%88%D8%B1%D8%AF%20%D8%A7%D9%86%D9%8A%D9%85%D9%8A%D8%B4%D9%86750.png",
  },
  {
    title: "Mobile App Development with Flutter",
    category: "Mobile",
    price: 74.99,
    duration: "8 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/5056d5cc-c8ce-41a2-961f-52cd7d9a48e0_20-%20%D8%A7%D8%AE%D8%AA%D8%B1%D8%A7%D8%B9%20%D8%A7%D9%84%D8%B1%D9%88%D8%A8%D9%88%D8%AA%D8%A7%D8%AA.jpg",
  },
  {
    title: "Introduction to Cyber Security",
    category: "Cyber Security",
    price: 64.99,
    duration: "6 weeks",
    image: "https://api.courssat.com/api/FileManage/Image/1/true/50d74c88-5338-497f-9ed8-ca7cc46c89ab_%D9%85%D9%81%D8%A7%D8%AA%D9%8A%D8%AD%20%D8%A7%D9%84%D8%AA%D9%81%D9%88%D9%82%20%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%B3%D9%8A%20!%20(1).png",
  },
];

// صورة افتراضية في حالة فشل تحميل الصورة
const fallbackImage = "https://via.placeholder.com/300x200.png?text=Course+Image";

const Home = () => {
  // إضافة وصف لكل كورس
  const coursesWithDescription = coursesData.map((course) => ({
    ...course,
    description: `Master ${course.title} with hands-on projects and expert guidance.`,
  }));

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

  // دالة للتعامل مع فشل تحميل الصورة
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

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