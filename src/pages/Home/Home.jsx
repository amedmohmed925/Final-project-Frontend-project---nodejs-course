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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsSection from "./StatsSection.jsx";
import ChooseUsSection from "./ChooseUsSection.jsx";
import StudentReviewsSection from "./StudentReviewsSection.jsx"; // Import the new component

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
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
                  <h1 className="hero-title animate__animated animate__bounceInDown animate__delay-1">
                    Welcome to Our <span className="text-light">EduQuest</span>{" "}
                    Platform
                  </h1>
                </div>
                <p className="hero-subtitle animate__animated animate__bounceIn animate__delay-3">
                  Learn from the best instructors and enhance your skills.
                </p>
                <Form
                  className="search-form animate__animated animate__bounceInUp animate__delay-2"
                  onSubmit={handleSearch}
                >
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search for a course..."
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" className="search-button">
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
      <MostViewedCoursesSlider />
      <StatsSection />
      <ChooseUsSection />
      <FeaturesSection />
      <ImageContentSection />
      <Gallery />
      <StudentReviewsSection /> 
    </div>
  );
};

export default Home;