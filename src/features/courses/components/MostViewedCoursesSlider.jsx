import FavoriteButton from '../../student/favorites/FavoriteButton';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Container, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { getMostViewedCourses } from "../api/courseApi";
import "../styles/MostViewedCourses.css";

const MostViewedCoursesSlider = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <span key={i} className="mvc-star mvc-filled">
          ★
        </span>
      );
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <span key={fullStars + 1} className="mvc-star mvc-half-filled">
          ★
        </span>
      );
    }
    const remainingStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 1; i <= remainingStars; i++) {
      stars.push(
        <span key={fullStars + (hasHalfStar ? 2 : 1) + i} className="mvc-star">
          ★
        </span>
      );
    }
    return stars;
  };

  const truncateDescription = (description) => {
    return description.length > 50
      ? description.substring(0, 50) + "..."
      : description;
  };

  useEffect(() => {
    const fetchMostViewedCourses = async () => {
      try {
        const data = await getMostViewedCourses(10);
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setCourses([]);
        setLoading(false);
      }
    };
    fetchMostViewedCourses();
  }, []);

 

  if (loading) {
    return (
      <div className="mvc-text-center">
        <Spinner animation="border" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mvc-text-center mvc-text-danger">Error: {error}</div>
    );
  }

  return (
    <section className="mvc-section">
      <Container>
        <div className="text-center">
          <h2 className="fw-bold">Explore Our Top-Viewed Courses</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 700 }}>
            Unlock your potential with a tailored educational journey designed to empower you and elevate your aspirations.
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          navigation={{ clickable: true }}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: true,
            reverseDirection: true,
          }}
          speed={3000}
          breakpoints={{
            1024: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 1, spaceBetween: 15 },
            480: { slidesPerView: 1, spaceBetween: 10 },
          }}
          className="mvc-swiper"
        >
          {Array.isArray(courses) && courses.length > 0 ? (
            courses.map((course) => (
              <SwiperSlide key={course._id} className="mvc-slider-item">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mvc-course-item position-relative">
                    <div className="mvc-img-wrapper position-relative">
                      <img
                        src={course.featuredImage}
                        alt={course.title}
                      />
                      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                        <FavoriteButton courseId={course._id} size={28} />
                      </div>
                      {course.duration && (
                        <span className="mvc-course-duration">
                          {course.duration}
                        </span>
                      )}
                    </div>
                    <div className="mvc-course-details">
                      <h3 className="mvc-course-name d-flex align-items-center justify-content-between">
                        {course.title}
                        <span className="d-md-none ms-2">
                          <FavoriteButton courseId={course._id} size={22} />
                        </span>
                      </h3>
                      <p className="mvc-course

-desc">
                        {truncateDescription(course.description)}
                      </p>
                      <div className="mvc-course-info">
                        <div className="mvc-rating">
                          {renderStars(course.averageRating)}
                          <span>({course.averageRating})</span>
                        </div>
                        <span className="mvc-course-level">{course.level}</span>
                      </div>
                      <button
                        className="mvc-enroll-btn"
                        onClick={() => navigate(`/courses/${course._id}`)}
                      >
                        Enroll Now
                        <span className="mvc-price">${course.price}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="mvc-text-center">No courses available</div>
            </SwiperSlide>
          )}
        </Swiper>
      </Container>
    </section>
  );
};

export default MostViewedCoursesSlider;