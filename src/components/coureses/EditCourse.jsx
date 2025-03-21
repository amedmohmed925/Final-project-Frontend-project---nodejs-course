import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { getCourseById, updateCourse, getResources } from "../../api/courseApi"; // إضافة getResources
import { getCategories } from "../../api/categoryApi"; // إضافة getResources
import Logo from "../Logo";
import "../../styles/CourseDetails.css";
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const EditCourse = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [resources, setResources] = useState([]);
  const [tags, setTags] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [targetAudience, setTargetAudience] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourseAndData = async () => {
      try {
        setIsLoading(true);

        // جلب بيانات الكورس
        const course = await getCourseById(id);
        setTitle(course.title);
        setDescription(course.description);
        setPrice(course.price.toString());
        setLevel(course.level);
        setCategory(course.category);
        setSections(
          course.sections.map((section) => ({
            title: section.title,
            lessons: section.lessons.map((lesson) => ({
              title: lesson.title,
              content: lesson.content,
              videoUrl: lesson.videoUrl,
              thumbnailUrl: lesson.thumbnailUrl,
              quiz: lesson.quiz || "",
              video: null,
              thumbnail: null,
            })),
          }))
        );
        setTags(course.tags.join(", "));
        setWhatYouWillLearn(course.whatYouWillLearn || []);
        setRequirements(course.requirements || []);
        setTargetAudience(course.targetAudience || []);

        // جلب الفئات
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // جلب الموارد الخاصة بالكورس
        const resourcesData = await getResources(id);
        setResources(resourcesData);
      } catch (err) {
        setError(err.message);
        setShowModal(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseAndData();
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

  const handleAddListItem = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  const handleListItemChange = (setter, index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
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
          type: r.type || "video",
          url: r.url,
        })),
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        whatYouWillLearn,
        requirements,
        targetAudience,
      };

      const updatedCourse = await updateCourse(id, courseData);
      setSuccess("Course updated successfully!");
      setUploadStatus(updatedCourse.message || "Videos and thumbnails are being uploaded in the background");
      setShowModal(true);

      setTimeout(() => navigate("/CoursesTeacher"), 2000);
    } catch (err) {
      setError(err.message);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !title) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="course-creation-page">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
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
                    onChange={(e) => setTitle(e.target.value)}
                    required
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
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
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

                {/* What You Will Learn */}
                <Form.Group className="course-input-group">
                  <Form.Label>What You Will Learn</Form.Label>
                  {whatYouWillLearn.map((item, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      placeholder="Enter what students will learn"
                      value={item}
                      onChange={(e) => handleListItemChange(setWhatYouWillLearn, index, e.target.value)}
                      className="mb-2"
                      disabled={isLoading}
                    />
                  ))}
                  <Button
                    variant="outline-primary"
                    onClick={() => handleAddListItem(setWhatYouWillLearn)}
                    disabled={isLoading}
                  >
                    Add Item
                  </Button>
                </Form.Group>

                {/* Requirements */}
                <Form.Group className="course-input-group">
                  <Form.Label>Requirements</Form.Label>
                  {requirements.map((item, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      placeholder="Enter requirement"
                      value={item}
                      onChange={(e) => handleListItemChange(setRequirements, index, e.target.value)}
                      className="mb-2"
                      disabled={isLoading}
                    />
                  ))}
                  <Button
                    variant="outline-primary"
                    onClick={() => handleAddListItem(setRequirements)}
                    disabled={isLoading}
                  >
                    Add Requirement
                  </Button>
                </Form.Group>

                {/* Target Audience */}
                <Form.Group className="course-input-group">
                  <Form.Label>Target Audience</Form.Label>
                  {targetAudience.map((item, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      placeholder="Enter target audience"
                      value={item}
                      onChange={(e) => handleListItemChange(setTargetAudience, index, e.target.value)}
                      className="mb-2"
                      disabled={isLoading}
                    />
                  ))}
                  <Button
                    variant="outline-primary"
                    onClick={() => handleAddListItem(setTargetAudience)}
                    disabled={isLoading}
                  >
                    Add Audience
                  </Button>
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

                    {section.lessons.map((lesson, lessonIndex) => (
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
                <Form.Group className="course-input-group">
                  <Form.Label>Resources</Form.Label>
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
                          <option value="article">Article</option>
                          <option value="pdf">PDF</option>
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
                  <Button
                    variant="outline-primary"
                    onClick={handleAddResource}
                    className="course-add-btn mb-4"
                    disabled={isLoading}
                  >
                    Add Resource
                  </Button>
                </Form.Group>

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
                      Updating... <Spinner animation="border" size="sm" />
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