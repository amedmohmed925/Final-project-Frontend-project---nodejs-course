import { useEffect, useState } from "react";
import "../../styles/Courses.css";

// قائمة الفئات
const categories = [
  "All", "Frontend", "Backend", "Full-Stack", "Mobile", "AI", "Cyber Security"
];

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
  // يمكنك إضافة المزيد من الكورسات مع صور مناسبة
];

// صورة افتراضية في حالة فشل تحميل الصورة
const fallbackImage = "https://via.placeholder.com/300x200.png?text=Course+Image";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const updatedCourses = coursesData.map((course, index) => ({
      id: index + 1,
      ...course,
      description: `Master ${course.title} with hands-on projects and expert guidance.`,
    }));
    setCourses(updatedCourses);
    setFilteredCourses(updatedCourses);
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
          <div key={course.id} className="course-card">
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