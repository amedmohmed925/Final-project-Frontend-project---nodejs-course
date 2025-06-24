import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import "animate.css";
import FeaturesSection from "./FeaturesSection";
import TeamSection from "./TeamSection";
import Gallery from "./Gallery";
import ImageContentSection from "./ImageContentSection";
import MostViewedCoursesSlider from "../../features/courses/components/MostViewedCoursesSlider.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsSection from "./StatsSection.jsx";
import ChooseUsSection from "./ChooseUsSection.jsx";
import StudentReviewsSection from "./StudentReviewsSection.jsx";
import ModernEduQuestHero from "./ModernEduQuestHero.jsx";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Animation variants for motion
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <Container>
            <Row className="justify-content-center align-items-center min-vh-100">
              <Col xs={12} md={8} className="text-center">
                <motion.h1
                  className="hero-title"
                  initial="hidden"
                  animate="visible"
                  variants={titleVariants}
                >
                  Empower Your Future with{" "}
                  <span className="highlight-text">EduQuest</span>
                </motion.h1>
                <motion.p
                  className="hero-subtitle"
                  initial="hidden"
                  animate="visible"
                  variants={subtitleVariants}
                >
                  Elevate your skills with world-class courses crafted by industry leaders.
                </motion.p>
                <motion.div
                  className="search-container"
                  initial="hidden"
                  animate="visible"
                  variants={formVariants}
                >
                  <Form className="search-form" onSubmit={handleSearch}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Find your perfect course..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" className="search-button">
                        <Search />
                        <span className="search-button-text">Search</span>
                      </Button>
                    </InputGroup>
                  </Form>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
{/* <ModernEduQuestHero /> */}
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