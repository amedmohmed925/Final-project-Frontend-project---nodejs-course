import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoursesPreview } from "../../api/courseApi";
import { getCategories } from "../../api/categoryApi";
import "../../styles/Courses.css";
import { Spinner } from "react-bootstrap";
import HeaderPages from "../../components/HeaderPages";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]); // حالة لتخزين الفئات المجلوبة
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // جلب الكورسات والفئات عند تحميل المكون
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getAllCoursesPreview(),
          getCategories(),
        ]);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setCategories(["All", ...categoriesData.map(cat => cat.name)]); // إضافة "All" إلى الفئات
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // الفلترة بناءً على الفئة المختارة
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) => course.category === selectedCategory)
      );
    }
    setVisibleCount(8);
  }, [selectedCategory, courses]);

  const handleImageError = (e) => {
    e.target.src = "path/to/fallback-image.jpg"; // ضع مسار صورة احتياطية
  };

  const truncateDescription = (description) => {
    return description.length > 50 ? description.substring(0, 50) + "..." : description;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">جاري التحميل...</span>
      </Spinner>
    </div>
  );

  if (error) return <div>خطأ: {error}</div>;
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // عدد النجوم الكاملة
    const hasHalfStar = rating % 1 >= 0.5; // تحقق مما إذا كان هناك نصف نجمة (مثل 3.5 أو 4.7)
  
    // إضافة النجوم الكاملة
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <FaStar
          key={i}
          className="star filled"
        />
      );
    }
  
    // إضافة نصف نجمة إذا كان موجودًا
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <FaStarHalfAlt
          key={fullStars + 1}
          className="star filled"
        />
      );
    }
  
    // إضافة النجوم الفارغة لاستكمال 5 نجوم
    const remainingStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 1; i <= remainingStars; i++) {
      stars.push(
        <FaStar
          key={fullStars + (hasHalfStar ? 2 : 1) + i}
          className="star"
        />
      );
    }
  
    return stars;
  };
  return (
    <div>
      <HeaderPages title="Explore our courses" />
      <div className="courses-container">
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${category === selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filteredCourses.slice(0, visibleCount).map((course) => (
            <div key={course._id} className="course-card">
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
                  className="enroll-btn d-flex justify-content-center"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  Enroll Now
                  <div className="mx-2">${course.price}</div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="button-container">
          {visibleCount < filteredCourses.length && (
            <button className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + 6)}>
              Show More
            </button>
          )}
          {visibleCount > 6 && (
            <button className="show-less-btn" onClick={() => setVisibleCount(6)}>
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;