import { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { addCourse } from '../../api/courseApi';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa';
import '../../styles/AddCourse.css';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [category, setCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [lessons, setLessons] = useState([{ title: '', content: '', video: null, thumbnail: null, quiz: '' }]);
  const [resources, setResources] = useState([{ name: '', type: 'video', url: '' }]);
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddLesson = () => {
    setLessons([...lessons, { title: '', content: '', video: null, thumbnail: null, quiz: '' }]);
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
  };

  const handleVideoChange = (index, e) => {
    const file = e.target.files[0];
    if (file && !['video/mp4', 'video/mov'].includes(file.type)) {
      setError('Please upload a valid video file (mp4 or mov)');
      setShowModal(true);
      return;
    }
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, video: file } : lesson
    );
    setLessons(updatedLessons);
  };

  const handleThumbnailChange = (index, e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image file (jpeg, jpg, or png)');
      setShowModal(true);
      return;
    }
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, thumbnail: file } : lesson
    );
    setLessons(updatedLessons);
  };

  const handleAddResource = () => {
    setResources([...resources, { name: '', type: 'video', url: '' }]);
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = resources.map((resource, i) =>
      i === index ? { ...resource, [field]: value } : resource
    );
    setResources(updatedResources);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image file (jpeg, jpg, or png)');
      setShowModal(true);
      return;
    }
    setFeaturedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadStatus('');
    setIsLoading(true);

    if (!title || !description || !price || !category) {
      setError('Title, description, price, and category are required');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      setError('Price must be a valid positive number');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    const lessonsWithVideos = lessons.filter(lesson => lesson.title && lesson.content);
    const videoCount = lessonsWithVideos.filter(lesson => lesson.video).length;
    if (videoCount > 30) {
      setError('Maximum 30 lesson videos are allowed');
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const courseData = {
        title,
        description,
        price,
        level,
        category,
        featuredImage,
        lessons: lessonsWithVideos,
        resources: resources.filter(r => r.name && r.url),
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      };

      const newCourse = await addCourse(courseData);
      setSuccess('Course added successfully!');
      setUploadStatus(newCourse.message || 'Videos and thumbnails are being uploaded in the background');
      setShowModal(true);

      setTitle('');
      setDescription('');
      setPrice('');
      setLevel('Beginner');
      setCategory('');
      setFeaturedImage(null);
      setLessons([{ title: '', content: '', video: null, thumbnail: null, quiz: '' }]);
      setResources([{ name: '', type: 'video', url: '' }]);
      setTags('');

      setTimeout(() => navigate('/courses'), 7000);
    } catch (err) {
      setError(err.message);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="course-creation-page">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`course-sidebar-toggle ${isSidebarOpen ? "sidebar-expanded" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={10}>
            <motion.div
              className="course-form-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
               <div className="py-4 logoAuth text-center">
                <Logo colorText="#0a3e6e" />
                <motion.h2
                  className="fs-4 fw-bold mb-0 mt-3  section-title"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Add New Course
                </motion.h2>
              </div>

              <Form onSubmit={handleSubmit} className="course-form">
                <Form.Group className="course-input-group mb-3">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                    pattern="^[A-Za-z0-9\s\-_.,]+$"
                    title="Title can only contain letters, numbers, spaces, and basic punctuation"
                  />
                  <Form.Text className="text-muted">
                    Enter the name of your course.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="course-input-group mb-3">
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
                  <Form.Text className="text-muted">
                    Provide a brief overview of what the course covers.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="course-input-group mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Enter course price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    disabled={isLoading}
                  />
                  <Form.Text className="text-muted">
                    Set the price for your course in dollars (e.g., 29.99). Use 0 for free courses.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="course-input-group mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Professional">Professional</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Choose the difficulty level of your course.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="course-input-group mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select the main category your course belongs to.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="course-input-group mb-3">
                  <Form.Label>Featured Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <Form.Text className="text-muted">
                    Upload a featured image for the course (jpeg, jpg, or png). This will be the main image displayed.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="course-input-group mb-4">
                  <Form.Label className="fw-bold">Lessons</Form.Label>
                  <Form.Text className="text-muted d-block mb-2">
                    Add lessons to your course. Each lesson can include a title, content, video, thumbnail, and quiz.
                  </Form.Text>
                  {lessons.map((lesson, index) => (
                    <Row key={index} className="mb-3">
                      <Col xs={12}>
                      <h6>{`Lesson ${index + 1}`}</h6>

                        <Form.Control
                          type="text"
                          placeholder={`Lesson ${index + 1} Title`}
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                          required
                          disabled={isLoading}
                          pattern="^[A-Za-z0-9\s\-_.,]+$"
                          title="Title can only contain letters, numbers, spaces, and basic punctuation"
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          Enter the title of this lesson 
                        </Form.Text>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          type="text"
                          placeholder={`Lesson ${index + 1} Content`}
                          value={lesson.content}
                          onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                          required
                          disabled={isLoading}
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                           summary for this lesson.
                        </Form.Text>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          type="file"
                          accept="video/mp4,video/mov"
                          onChange={(e) => handleVideoChange(index, e)}
                          disabled={isLoading}
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          video for this lesson (mp4 or mov format).
                        </Form.Text>
                      </Col>
                      <Col xs={4}>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleThumbnailChange(index, e)}
                          disabled={isLoading}
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                         thumbnail image for the lesson video (jpeg, jpg, or png)
                        </Form.Text>
                      </Col>
                      <Col xs={12}>
                        <Form.Control
                          type="text"
                          placeholder={`Lesson ${index + 1} Quiz Title`}
                          value={lesson.quiz}
                          onChange={(e) => handleLessonChange(index, 'quiz', e.target.value)}
                          disabled={isLoading}
                          pattern="^[A-Za-z0-9\s\-_.,]+$"
                          title="Quiz title can only contain letters, numbers, spaces, and basic punctuation"
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          Enter a title for the quiz related to this lesson.
                        </Form.Text>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddLesson}
                    className="course-add-btn mt-2"
                    disabled={isLoading}
                  >
                    Add Another Lesson
                  </Button>
                </Form.Group>

                <Form.Group className="course-input-group mb-4">
                  <Form.Label className="fw-bold">Resources</Form.Label>
                  <Form.Text className="text-muted d-block mb-2">
                    Add additional resources like videos, articles, or PDFs to support your course.
                  </Form.Text>
                  {resources.map((resource, index) => (
                    <Row key={index} className="mb-3">
                      <h6>                          {`Resource ${index + 1}`}
                      </h6>
                      <Col xs={12}>
                        <Form.Control
                          type="text"
                          placeholder={`Resource ${index + 1} Name`}
                          value={resource.name}
                          onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                          disabled={isLoading}
                          pattern="^[A-Za-z0-9\s\-_.,]+$"
                          title="Name can only contain letters, numbers, spaces, and basic punctuation"
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          Enter the name of this resource (e.g., "JavaScript Cheat Sheet").
                        </Form.Text>
                      </Col>
                      <Col xs={12}>
                        <Form.Select
                          value={resource.type}
                          onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                          disabled={isLoading}
                          className="mb-2"
                        >
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="pdf">PDF</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Select the type of this resource.
                        </Form.Text>
                      </Col>
                      <Col xs={12}>
                        <Form.Control
                          type="url"
                          placeholder={`Resource ${index + 1} URL`}
                          value={resource.url}
                          onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                          disabled={isLoading}
                          pattern="https?://.+"
                          title="Please enter a valid URL starting with http:// or https://"
                          className="mb-2"
                        />
                        <Form.Text className="text-muted">
                          Provide a URL link to this resource (e.g., "https://example.com/resource").
                        </Form.Text>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddResource}
                    className="course-add-btn mt-2"
                    disabled={isLoading}
                  >
                    Add Another Resource
                  </Button>
                </Form.Group>

                <Form.Group className="course-input-group mb-4">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., web, html, css"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isLoading}
                    pattern="^[A-Za-z0-9\s,]+$"
                    title="Tags can only contain letters, numbers, spaces, and commas"
                  />
                  <Form.Text className="text-muted">
                    Add tags to help users find your course (e.g., "web, html, css").
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-center py-3">
                  <Button
                    type="submit"
                    className="course-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="course-spinner me-2" /> Adding...
                      </>
                    ) : (
                      'Add Course'
                    )}
                  </Button>
                </div>
                {uploadStatus && (
                  <p className="text-center text-muted mt-2">{uploadStatus}</p>
                )}
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light border-bottom">
          <Modal.Title>{success ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {success || error}
          {uploadStatus && <p>{uploadStatus}</p>}
        </Modal.Body>
        <Modal.Footer className="bg-light border-top">
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: "#6a11cb", borderColor: "#6a11cb" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCourse;