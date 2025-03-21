import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Modal, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { getCoursesByTeacher, deleteCourse } from "../../api/courseApi"; // تأكد من المسار الصحيح
import "../../styles/Courses.css"; // تأكد من إضافة الـ CSS الذي قدمته
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // لتحديد الكورس المراد حذفه
  const [showDeleteModal, setShowDeleteModal] = useState(false); // لعرض Modal الحذف
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const navigate = useNavigate();

  // جلب كورسات المعلم عند تحميل المكون
  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const teacherId = "67ca22c2d8e0df490495b712"; // يمكنك جعل هذا ديناميكيًا بناءً على تسجيل الدخول
        const data = await getCoursesByTeacher(teacherId);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching teacher courses:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherCourses();
  }, []);

  // التعامل مع صورة الكورس في حالة الخطأ
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x180?text=Image+Not+Found";
  };

  // تقصير الوصف لعرض جزء منه فقط
  const truncateDescription = (desc) => {
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  // التعامل مع حذف الكورس
  const handleDeleteCourse = async () => {
    try {
      await deleteCourse(selectedCourseId);
      setCourses(courses.filter((course) => course._id !== selectedCourseId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting course:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
 <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="courses-container">
        <div className="py-4  text-center">
                        <motion.h2
                          className="fs-3 fw-bold mb-0 mt-3 section-title"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          MY Courses
                        </motion.h2>
                      </div>
        <div className="courses-grid my-4">
          {courses.slice(0, visibleCount).map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-image">
                <img
                  src={course.featuredImage}
                  alt={course.title}
                  onError={handleImageError}
                />
                <span className="hourCourse">
                  <i className="fa-regular fa-clock"></i> 2 hour
                </span>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{truncateDescription(course.description)}</p>
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
                <div className="mt-3">
                 <div className="d-flex justify-content-center">

                  <Button
                  className="m-2"
                    variant="outline-primary"
                    onClick={() => navigate(`/edit-course/${course._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                  className="m-2"
                    variant="outline-danger"
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                 </div>
                  <Button
                    className="enroll-btn"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-container">
          {visibleCount < courses.length && (
            <button
              className="show-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
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

      {/* Modal لتأكيد الحذف */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this course? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCourse}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherCourses;