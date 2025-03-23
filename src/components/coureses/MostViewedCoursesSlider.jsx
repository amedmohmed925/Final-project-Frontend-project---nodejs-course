import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getMostViewedCourses } from '../../api/courseApi';
import "../../styles/MostViewedCourses.css"; // New CSS file

const MostViewedCoursesSlider = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<span key={fullStars + 1} className="star half-filled">★</span>);
    }
    const remainingStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 1; i <= remainingStars; i++) {
      stars.push(<span key={fullStars + (hasHalfStar ? 2 : 1) + i} className="star">★</span>);
    }
    return stars;
  };

  // Truncate description
  const truncateDescription = (description) => {
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
  };

  // Custom arrow components (Moved up here)
  const CustomPrevArrow = (props) => (
    <button {...props} className="slick-prev custom-arrow">
      ❮
    </button>
  );

  const CustomNextArrow = (props) => (
    <button {...props} className="slick-next custom-arrow">
      ❯
    </button>
  );

  // Slider settings (Now uses CustomPrevArrow and CustomNextArrow after they are defined)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerPadding: "20px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "15px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "10px" } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerPadding: "5px" } },
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  // Fetch most viewed courses
  useEffect(() => {
    const fetchMostViewedCourses = async () => {
      try {
        const data = await getMostViewedCourses(10);
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMostViewedCourses();
  }, []);

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x200.png?text=Course+Image";
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  return (
    <section className="most-viewed-section">
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
          {courses.map((course) => (
            <div key={course._id} className="slider-item">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="course-item">
                  <div className="course-img-wrapper">
                    <img
                      src={course.featuredImage}
                      alt={course.title}
                      onError={handleImageError}
                    />
                    {course.duration && <span className="course-duration">{course.duration}</span>}
                  </div>
                  <div className="course-details">
                    <h3 className="course-name">{course.title}</h3>
                    <p className="course-desc">{truncateDescription(course.description)}</p>
                    <div className="course-info">
                      <div className="rating">
                        {renderStars(course.averageRating)}
                        <span>({course.averageRating})</span>
                      </div>
                      <span className="course-level">{course.level}</span>
                    </div>
                    <button
                      className="enroll-button"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      Enroll Now
                      <span className="price">${course.price}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default MostViewedCoursesSlider;