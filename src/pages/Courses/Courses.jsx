import { useEffect, useState } from "react";
import "../../styles/Courses.css";

const categories = [
  "All", "Frontend", "Backend", "Full-Stack", "Mobile", "AI", "Cyber Security"
];

const coursesData = [
  { title: "JavaScript Fundamentals", category: "Frontend" },
  { title: "React for Beginners", category: "Frontend" },
  { title: "Advanced Node.js", category: "Backend" },
  { title: "Full-Stack Web Development", category: "Full-Stack" },
  { title: "Python for Data Science", category: "AI" },
  { title: "Machine Learning with TensorFlow", category: "AI" },
  { title: "Mobile App Development with Flutter", category: "Mobile" },
  { title: "Introduction to Cyber Security", category: "Cyber Security" },
  { title: "Django and REST APIs", category: "Backend" },
  { title: "GraphQL with Apollo", category: "Full-Stack" },
  { title: "TypeScript Mastery", category: "Frontend" },
  { title: "CSS Animations and Effects", category: "Frontend" },
  { title: "DevOps and CI/CD Pipelines", category: "Full-Stack" },
  { title: "Vue.js Essentials", category: "Frontend" },
  { title: "Angular from Zero to Hero", category: "Frontend" },
  { title: "Next.js for Modern Web Apps", category: "Frontend" },
  { title: "Building Scalable Microservices", category: "Backend" },
  { title: "PHP and Laravel Crash Course", category: "Backend" },
  { title: "MongoDB & NoSQL Databases", category: "Backend" },
  { title: "AI and Natural Language Processing", category: "AI" },
  
    { title: "Web Accessibility & Best Practices", category: "Frontend" },
    { title: "Svelte for Beginners", category: "Frontend" },
    { title: "Nuxt.js & Vue Advanced Concepts", category: "Frontend" },
    { title: "Express.js & API Development", category: "Backend" },
    { title: "NestJS – Scalable Node.js Apps", category: "Backend" },
    { title: "Golang for Backend Development", category: "Backend" },
    { title: "Full-Stack MERN Development", category: "Full-Stack" },
    { title: "JAMstack Modern Web Architecture", category: "Full-Stack" },
    { title: "Flutter Advanced UI & Animations", category: "Mobile" },
    { title: "React Native Complete Guide", category: "Mobile" },
    { title: "Swift & iOS App Development", category: "Mobile" },
    { title: "Kotlin for Android Development", category: "Mobile" },
    { title: "Deep Learning with PyTorch", category: "AI" },
    { title: "AI Chatbots with Python & NLP", category: "AI" },
    { title: "Cyber Security for Ethical Hackers", category: "Cyber Security" },
    { title: "Blockchain & Web3 Development", category: "Cyber Security" },
    { title: "AWS Cloud Computing Fundamentals", category: "Full-Stack" },
    { title: "Google Cloud Platform – Hands-on", category: "Full-Stack" },
    { title: "Docker & Kubernetes Masterclass", category: "Full-Stack" },
    { title: "Penetration Testing & Ethical Hacking", category: "Cyber Security" }
  
  
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const updatedCourses = coursesData.map((course, index) => ({
      id: index + 1,
      ...course,
      description: `This is a detailed description for ${course.title}.`,
      image: `https://picsum.photos/300/200?random=${index + 1}`,
    }));
    setCourses(updatedCourses);
    setFilteredCourses(updatedCourses);
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) => course.category === selectedCategory)
      );
    }
    setVisibleCount(6); // إعادة تعيين العدد عند تغيير الفئة
  }, [selectedCategory, courses]);

  return (
    <div className="courses-container" style={{marginTop:"100px"}}>
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
              <img src={course.image} alt={course.title} />
            </div>
            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-action">
                <span>View Course</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="button-container">
        {visibleCount < filteredCourses.length && (
          <button className="show-more-btn" onClick={() => setVisibleCount(prev => prev + 6)}>
            Show More
          </button>
        )}
        {visibleCount > 8 && (
          <button className="show-less-btn" onClick={() => setVisibleCount(6)}>
            Show Less
          </button>
        )}
      </div>
    </div>
  );
};

export default Courses;
