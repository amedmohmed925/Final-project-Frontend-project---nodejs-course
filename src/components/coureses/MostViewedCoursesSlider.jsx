// components/MostViewedCoursesSlider.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getMostViewedCourses } from '../../api/courseApi'; 
import "../../styles/Courses.css"; 

const MostViewedCoursesSlider = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // دالة لعرض النجوم بناءً على التقييم
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
      );
    }
    return stars;
  };

  // دالة لتقصير الوصف إذا كان طويل
  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 97) + '...' : description;
  };

  // جلب الكورسات عند تحميل المكون
  useEffect(() => {
    const fetchMostViewedCourses = async () => {
      try {
        const data = await getMostViewedCourses(10); // جلب أعلى 10 كورسات
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMostViewedCourses();
  }, []);

  // إعدادات الـ Slider
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

  // صورة افتراضية في حالة فشل تحميل الصورة
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x200.png?text=Course+Image";
  };

  if (loading) return <div className="text-center">Loading..</div>;
  if (error) return <div className="text-center text-danger">error: {error}</div>;

  return (
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
          {courses.map((course) => (
            <div key={course._id} className="px-2">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="course-card">
                  <div className="course-image">
                    <img
                      src={course.featuredImage}
                      alt={course.title}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{truncateDescription(course.description)}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="course-rating">
                        {renderStars(course.averageRating)}
                        <span>({course.averageRating})</span>
                      </div>
                      <span className="courseLevel">{course.level}</span>
                    </div>
                    <button
                      className="enroll-btn d-flex justify-content-center align-items-center"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      Enroll Now
                      <div className="mx-2">${course.price}</div>
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