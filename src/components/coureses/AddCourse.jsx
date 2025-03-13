import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { addCourse } from "../../api/courseApi"; // تأكد من المسار الصحيح
import Logo from "../Logo"; // افتراض أن لديك مكون Logo

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [category, setCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [sections, setSections] = useState([{ title: '', lessons: [{ title: '', content: '', video: null, thumbnail: null, quiz: '' }] }]);
  const [resources, setResources] = useState([{ name: '', type: 'video', url: '' }]);
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // إضافة قسم جديد
  const handleAddSection = () => {
    setSections([...sections, { title: '', lessons: [{ title: '', content: '', video: null, thumbnail: null, quiz: '' }] }]);
  };

  // تعديل عنوان القسم
  const handleSectionTitleChange = (sectionIndex, value) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex ? { ...section, title: value } : section
    );
    setSections(updatedSections);
  };

  // إضافة حلقة داخل قسم
  const handleAddLesson = (sectionIndex) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? { ...section, lessons: [...section.lessons, { title: '', content: '', video: null, thumbnail: null, quiz: '' }] }
        : section
    );
    setSections(updatedSections);
  };

  // تعديل بيانات الحلقة
  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            lessons: section.lessons.map((lesson, j) =>
              j === lessonIndex ? { ...lesson, [field]: value } : lesson
            ),
          }
        : section
    );
    setSections(updatedSections);
  };

  // تعديل فيديو الحلقة
  const handleVideoChange = (sectionIndex, lessonIndex, e) => {
    const file = e.target.files[0];
    if (file && !['video/mp4', 'video/mov'].includes(file.type)) {
      setError('Please upload a valid video file (mp4 or mov)');
      setShowModal(true);
      return;
    }
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            lessons: section.lessons.map((lesson, j) =>
              j === lessonIndex ? { ...lesson, video: file } : lesson
            ),
          }
        : section
    );
    setSections(updatedSections);
  };

  // تعديل الصورة المصغرة للحلقة
  const handleThumbnailChange = (sectionIndex, lessonIndex, e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image file (jpeg, jpg, or png)');
      setShowModal(true);
      return;
    }
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            lessons: section.lessons.map((lesson, j) =>
              j === lessonIndex ? { ...lesson, thumbnail: file } : lesson
            ),
          }
        : section
    );
    setSections(updatedSections);
  };

  // إضافة مورد
  const handleAddResource = () => {
    setResources([...resources, { name: '', type: 'video', url: '' }]);
  };

  // تعديل بيانات المورد
  const handleResourceChange = (index, field, value) => {
    const updatedResources = resources.map((resource, i) =>
      i === index ? { ...resource, [field]: value } : resource
    );
    setResources(updatedResources);
  };

  // تعديل الصورة المميزة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image file (jpeg, jpg, or png)');
      setShowModal(true);
      return;
    }
    setFeaturedImage(file);
  };

  // إرسال النموذج
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

    const totalVideos = sections.reduce((acc, section) => acc + section.lessons.filter(lesson => lesson.video).length, 0);
    if (totalVideos > 30) {
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
        sections: sections.map(section => ({
          title: section.title,
          lessons: section.lessons.filter(lesson => lesson.title && lesson.content),
        })),
        resources: resources.filter(r => r.name && r.url),
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      };

      const newCourse = await addCourse(courseData);
      setSuccess('Course added successfully!');
      setUploadStatus(newCourse.message || 'Videos and thumbnails are being uploaded in the background');
      setShowModal(true);

      // إعادة تعيين الحقول
      setTitle('');
      setDescription('');
      setPrice('');
      setLevel('Beginner');
      setCategory('');
      setFeaturedImage(null);
      setSections([{ title: '', lessons: [{ title: '', content: '', video: null, thumbnail: null, quiz: '' }] }]);
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
                className="fs-4 fw-bold mb-0 mt-3 section-title"
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
                />
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
              </Form.Group>

              <Form.Group className="course-input-group mb-3">
                <Form.Label>Featured Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </Form.Group>

              {/* الأقسام */}
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="section-group mb-4 p-3 border rounded">
                  <Form.Group className="mb-3">
                    <Form.Label>Section Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter section title (e.g., HTML Basics)"
                      value={section.title}
                      onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="lesson-group mb-3 p-3 border rounded">
                      <Form.Group className="mb-2">
                        <Form.Label>Lesson Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter lesson title"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Lesson Content</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Enter lesson content"
                          value={lesson.content}
                          onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'content', e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Lesson Video</Form.Label>
                        <Form.Control
                          type="file"
                          accept="video/mp4,video/mov"
                          onChange={(e) => handleVideoChange(sectionIndex, lessonIndex, e)}
                          disabled={isLoading}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Lesson Thumbnail</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleThumbnailChange(sectionIndex, lessonIndex, e)}
                          disabled={isLoading}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Quiz (Optional)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter quiz title"
                          value={lesson.quiz}
                          onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'quiz', e.target.value)}
                          disabled={isLoading}
                        />
                      </Form.Group>
                    </div>
                  ))}

                  <Button
                    variant="outline-primary"
                    onClick={() => handleAddLesson(sectionIndex)}
                    className="mb-3"
                    disabled={isLoading}
                  >
                    Add Lesson
                  </Button>
                </div>
              ))}

              <Button variant="primary" onClick={handleAddSection} className="mb-4" disabled={isLoading}>
                Add Section
              </Button>

              {/* الموارد */}
              {resources.map((resource, index) => (
                <div key={index} className="resource-group mb-3 p-3 border rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Resource Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter resource name"
                      value={resource.name}
                      onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={resource.type}
                      onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="link">Link</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="Enter resource URL"
                      value={resource.url}
                      onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Form.Group>
                </div>
              ))}

              <Button variant="outline-primary" onClick={handleAddResource} className="mb-4" disabled={isLoading}>
                Add Resource
              </Button>

              <Form.Group className="course-input-group mb-3">
                <Form.Label>Tags (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., HTML, CSS, Web"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isLoading}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Add Course'}
              </Button>

              {/* Modal للرسائل */}
              {showModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}
                    {uploadStatus && <p className="text-info">{uploadStatus}</p>}
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCourse;