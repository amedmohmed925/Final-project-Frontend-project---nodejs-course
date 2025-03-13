// src/components/EditCourse.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { getCourseById, updateCourse } from "../../api/courseApi"; // تأكد من المسار الصحيح
import Logo from "../Logo"; // افتراض أن لديك مكون Logo
import "../../styles/CourseDetails.css"; // تأكد من أن المسار يشمل الـ CSS المحدث

const EditCourse = () => {
  const { id } = useParams(); // معرف الكورس من الـ URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [category, setCategory] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [resources, setResources] = useState([]);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // جلب بيانات الكورس عند تحميل المكون
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const course = await getCourseById(id);
        setTitle(course.title);
        setDescription(course.description);
        setPrice(course.price.toString());
        setLevel(course.level);
        setCategory(course.category);
        setSections(course.sections.map((section) => ({
          title: section.title,
          lessons: section.lessons.map((lesson) => ({
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            thumbnailUrl: lesson.thumbnailUrl,
            quiz: lesson.quiz || "",
            video: null, // لرفع فيديو جديد
            thumbnail: null, // لرفع صورة مصغرة جديدة
          })),
        })));
        setResources(course.resources);
        setTags(course.tags.join(", "));
      } catch (err) {
        setError(err.message);
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", content: "", video: null, thumbnail: null, quiz: "" }] }]);
  };

  const handleSectionTitleChange = (sectionIndex, value) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex ? { ...section, title: value } : section
    );
    setSections(updatedSections);
  };

  const handleAddLesson = (sectionIndex) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? { ...section, lessons: [...section.lessons, { title: "", content: "", video: null, thumbnail: null, quiz: "" }] }
        : section
    );
    setSections(updatedSections);
  };

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

  const handleVideoChange = (sectionIndex, lessonIndex, e) => {
    const file = e.target.files[0];
    if (file && !["video/mp4", "video/mov"].includes(file.type)) {
      setError("Please upload a valid video file (mp4 or mov)");
      setShowModal(true);
      return;
    }
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            lessons: section.lessons.map((lesson, j) =>
              j === lessonIndex ? { ...lesson, video: file, videoUrl: "" } : lesson
            ),
          }
        : section
    );
    setSections(updatedSections);
  };

  const handleThumbnailChange = (sectionIndex, lessonIndex, e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please upload a valid image file (jpeg, jpg, or png)");
      setShowModal(true);
      return;
    }
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            lessons: section.lessons.map((lesson, j) =>
              j === lessonIndex ? { ...lesson, thumbnail: file, thumbnailUrl: "" } : lesson
            ),
          }
        : section
    );
    setSections(updatedSections);
  };

  const handleAddResource = () => {
    setResources([...resources, { name: "", type: "video", url: "" }]);
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = resources.map((resource, i) =>
      i === index ? { ...resource, [field]: value } : resource
    );
    setResources(updatedResources);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please upload a valid image file (jpeg, jpg, or png)");
      setShowModal(true);
      return;
    }
    setFeaturedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploadStatus("");
    setIsLoading(true);
  
    if (!title || !description || !price || !category) {
      setError("Title, description, price, and category are required");
      setShowModal(true);
      setIsLoading(false);
      return;
    }
  
    if (isNaN(price) || parseFloat(price) < 0) {
      setError("Price must be a valid positive number");
      setShowModal(true);
      setIsLoading(false);
      return;
    }
  
    const totalVideos = sections.reduce((acc, section) => acc + section.lessons.filter((lesson) => lesson.video).length, 0);
    if (totalVideos > 30) {
      setError("Maximum 30 lesson videos are allowed");
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
        sections: sections.map((section) => ({
          title: section.title,
          lessons: section.lessons.filter((lesson) => lesson.title && lesson.content).map((lesson) => ({
            title: lesson.title,
            content: lesson.content,
            quiz: lesson.quiz,
            video: lesson.video,
            thumbnail: lesson.thumbnail,
            videoUrl: lesson.videoUrl,
            thumbnailUrl: lesson.thumbnailUrl,
          })),
        })),
        resources: resources.filter((r) => r.name && r.url).map((r) => ({
          name: r.name,
          type: r.type || "link", // تأكد من وجود type
          url: r.url,
        })),
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      };
  
      console.log("Submitting Course Data:", courseData); // تحقق من البيانات قبل الإرسال
      const updatedCourse = await updateCourse(id, courseData);
      setSuccess("Course updated successfully!");
      setUploadStatus(updatedCourse.message || "Videos and thumbnails are being uploaded in the background");
      setShowModal(true);
  
      setTimeout(() => navigate("/courses"), 7000);
    } catch (err) {
      setError(err.message);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !title) {
    return <div className="loading-overlay"><div className="spinner"></div>Loading...</div>;
  }

  return (
    <div className="course-creation-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={10}>
            <motion.div
              className="course-form-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="course-logo-section text-center">
                <Logo colorText="#0a3e6e" />
                <motion.h2
                  className="course-form-title mt-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Edit Course
                </motion.h2>
              </div>

              <Form onSubmit={handleSubmit} className="course-form">
                <Form.Group className="course-input-group">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter course title"
                    value={title}
                    
                    onChange={(e) => {
                        console.log("New Title:", e.target.value);
                        setTitle(e.target.value);
                      }}                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="course-input-group">
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

                <Form.Group className="course-input-group">
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

                <Form.Group className="course-input-group">
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

                <Form.Group className="course-input-group">
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

                <Form.Group className="course-input-group">
                  <Form.Label>Featured Image (Upload new if needed)</Form.Label>
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
                    <Form.Group className="course-input-group">
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

                    {section.lessons.map((lesson, lessonplantsNumberedSectionIndexlessonIndex, lessonIndex) => (
                      <div key={lessonIndex} className="lesson-group mb-3 p-3 border rounded">
                        <Form.Group className="course-input-group">
                          <Form.Label>Lesson Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter lesson title"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "title", e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>

                        <Form.Group className="course-input-group">
                          <Form.Label>Lesson Content</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter lesson content"
                            value={lesson.content}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "content", e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </Form.Group>

                        <Form.Group className="course-input-group">
                          <Form.Label>Lesson Video (Upload new if needed)</Form.Label>
                          {lesson.videoUrl && !lesson.videoUrl.startsWith("pending:") && (
                            <p>Current Video: <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">View</a></p>
                          )}
                          <Form.Control
                            type="file"
                            accept="video/mp4,video/mov"
                            onChange={(e) => handleVideoChange(sectionIndex, lessonIndex, e)}
                            disabled={isLoading}
                          />
                        </Form.Group>

                        <Form.Group className="course-input-group">
                          <Form.Label>Lesson Thumbnail (Upload new if needed)</Form.Label>
                          {lesson.thumbnailUrl && !lesson.thumbnailUrl.startsWith("pending:") && (
                            <p>Current Thumbnail: <img src={lesson.thumbnailUrl} alt="Thumbnail" style={{ maxWidth: "100px" }} /></p>
                          )}
                          <Form.Control
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={(e) => handleThumbnailChange(sectionIndex, lessonIndex, e)}
                            disabled={isLoading}
                          />
                        </Form.Group>

                        <Form.Group className="course-input-group">
                          <Form.Label>Quiz (Optional)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter quiz title"
                            value={lesson.quiz}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, "quiz", e.target.value)}
                            disabled={isLoading}
                          />
                        </Form.Group>
                      </div>
                    ))}

                    <Button
                      variant="outline-primary"
                      onClick={() => handleAddLesson(sectionIndex)}
                      className="course-add-btn"
                      disabled={isLoading}
                    >
                      Add Lesson
                    </Button>
                  </div>
                ))}

                <Button variant="primary" onClick={handleAddSection} className="course-add-btn mb-4" disabled={isLoading}>
                  Add Section
                </Button>

                {/* الموارد */}
                {resources.map((resource, index) => (
                  <div key={index} className="resource-group mb-3 p-3 border rounded">
                    <Form.Group className="course-input-group">
                      <Form.Label>Resource Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter resource name"
                        value={resource.name}
                        onChange={(e) => handleResourceChange(index, "name", e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </Form.Group>

                    <Form.Group className="course-input-group">
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={resource.type}
                        onChange={(e) => handleResourceChange(index, "type", e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="link">Link</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="course-input-group">
                      <Form.Label>URL</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter resource URL"
                        value={resource.url}
                        onChange={(e) => handleResourceChange(index, "url", e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </Form.Group>
                  </div>
                ))}

                <Button variant="outline-primary" onClick={handleAddResource} className="course-add-btn mb-4" disabled={isLoading}>
                  Add Resource
                </Button>

                <Form.Group className="course-input-group">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., HTML, CSS, Web"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isLoading}
                  />
                </Form.Group>

                <Button type="submit" className="course-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <span>
                      Updating... <span className="course-spinner">⟳</span>
                    </span>
                  ) : (
                    "Update Course"
                  )}
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
    </div>
  );
};

export default EditCourse;