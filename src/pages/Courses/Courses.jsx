import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../../api/courseApi"; // استيراد الدالة
import "../../styles/Courses.css";
import { FaStar } from "react-icons/fa";

// قائمة الفئات
const categories = [
  "All", "Frontend", "Backend", "Full-Stack", "Mobile", "AI", "Cyber Security"
];

// صورة افتراضية في حالة فشل تحميل الصورة

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter((course) => course.category === selectedCategory));
    }
    setVisibleCount(8);
  }, [selectedCategory, courses]);

  // دالة للتعامل مع فشل تحميل الصورة
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  // تقصير الوصف لعرض جزء منه
  const truncateDescription = (description) => {
    return description.length > 50 ? description.substring(0, 50) + "..." : description;
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="courses-container">
      <div className="title-container">
        <h1 className="courses-title">Explore Our <span>Courses</span></h1>
      </div>

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
              <span className="hourCourse"> <i className="fa-regular fa-clock"></i> 2 hour</span>
            </div>
            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{truncateDescription(course.description)}</p>
              {/* <div className="course-details">
                <span className="course-level">{course.level}</span>
                <span className="course-date">{formatDate(course.createdAt)}</span>
              </div> */}
              <div className="d-flex justify-content-between align-items-center">

              <div className="course-rating">
                    <FaStar className="star filled" />
                    <FaStar className="star filled" />
                    <FaStar className="star filled" />
                    <FaStar className="star filled" />
                    <FaStar className="star" />
                    <span>(4.5)</span>
                  </div>
                  <span className="courseLevel">{course.level}</span>

              </div>
              <button
                className=" enroll-btn d-flex justify-content-center"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                              <div className="mx-2">${course.price}</div>

                Enroll Now
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
  );
};

export default Courses;