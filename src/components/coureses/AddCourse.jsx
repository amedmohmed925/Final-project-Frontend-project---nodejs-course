import { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { addCourse } from '../../api/courseApi';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa'; // أضفنا FaSpinner

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [lessons, setLessons] = useState([{ title: '' }]);
  const [lessonVideos, setLessonVideos] = useState([]);
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadStatus, setUploadStatus] = useState(''); // حالة جديدة للرفع
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddLesson = () => {
    setLessons([...lessons, { title: '' }]);
  };

  const handleLessonChange = (index, value) => {
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, title: value } : lesson
    );
    setLessons(updatedLessons);
  };

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    setLessonVideos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadStatus('');
    setIsLoading(true); // بدء التحميل

    if (!title || !description) {
      setError('Title and description are required');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (lessons.length !== lessonVideos.length) {
      setError('Number of videos must match the number of lessons');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (lessonVideos.length > 30) {
      setError('Maximum 30 lesson videos are allowed');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const courseData = {
        title,
        description,
        featuredImage,
        lessons,
        lessonVideos,
        tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      };

      const newCourse = await addCourse(courseData);
      setSuccess('Course added successfully!');
      setUploadStatus(newCourse.message || 'Videos are being uploaded in the background'); // رسالة من الـ Backend
      setShowModal(true);

      // إعادة تعيين النموذج بعد النجاح (اختياري)
      setTitle('');
      setDescription('');
      setFeaturedImage(null);
      setLessons([{ title: '' }]);
      setLessonVideos([]);
      setTags('');

      setTimeout(() => {
        navigate('/courses'); // الانتقال بعد 2 ثانية
      }, 2000);
    } catch (err) {
      setError(err.message);
      setShowModal(true);
    } finally {
      setIsLoading(false); // إنهاء التحميل
    }
  };

  return (
    <div className="add-course-page update-info-page d-flex align-items-center justify-content-center">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      {/* Sidebar */}
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Container>
        <Row className="align-items-center justify-content-center min-vh-100">
          <Col xs={12} md={8} lg={6} className="p-4">
            <motion.div
              className="form-section card p-4 shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-4 logoAuth text-center">
                <Logo colorText="#0a3e6e" />
                <motion.h2
                  className="fs-4 fw-bold mb-0 mt-3 section-title"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Add New Course
                </motion.h2>
              </div>

              <Form onSubmit={handleSubmit} className="auth-form">
                {/* العنوان */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading} // تعطيل أثناء التحميل
                  />
                </Form.Group>

                {/* الوصف */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter course description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                {/* الصورة المميزة */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Featured Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <Form.Text className="text-muted">
                    Upload an image (jpeg, jpg, or png).
                  </Form.Text>
                </Form.Group>

                {/* الدروس */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Lessons</Form.Label>
                  {lessons.map((lesson, index) => (
                    <Row key={index} className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder={`Lesson ${index + 1} Title`}
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(index, e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddLesson}
                    className="mt-2 rounded-pill"
                    disabled={isLoading}
                  >
                    Add Another Lesson
                  </Button>
                </Form.Group>

                {/* الفيديوهات */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Lesson Videos</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/mp4,video/mov"
                    multiple
                    onChange={handleVideosChange}
                    disabled={isLoading}
                  />
                  <Form.Text className="text-muted">
                    Upload videos (mp4 or mov). Number of videos must match the number of lessons.
                  </Form.Text>
                </Form.Group>

                {/* العلامات */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., web, html, css"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isLoading}
                  />
                </Form.Group>

                {/* زر الإرسال */}
                <div className="d-flex flex-column align-items-center py-3">
                  <Button
                    type="submit"
                    className="auth-button rounded-pill"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="spinner me-2" /> Adding...
                      </>
                    ) : (
                      'Add Course'
                    )}
                  </Button>
                  {uploadStatus && (
                    <p className="text-muted mt-2">{uploadStatus}</p>
                  )}
                </div>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Modal لعرض الرسائل */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <Modal.Title style={{ color: "#212529" }}>
            {success ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f9fa", color: "#212529" }}>
          {success || error}
          {uploadStatus && <p>{uploadStatus}</p>} {/* عرض حالة الرفع في الـ Modal */}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "var(--mainColor)",
              borderColor: "var(--mainColor)",
              color: "#000",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCourse;