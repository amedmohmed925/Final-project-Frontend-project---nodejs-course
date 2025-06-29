import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createExam, addQuestion } from "../api/examApi";
import { getCoursesByTeacher } from "../../courses/api/courseApi";
import { Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const defaultQuestion = { type: "multiple_choice", text: "", options: ["", "", "", ""], correctAnswer: "" };

const ExamCreate = () => {
  const { user } = useSelector((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([ { ...defaultQuestion } ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?._id) return;
      try {
        const res = await getCoursesByTeacher(user._id);
        const coursesArr = Array.isArray(res.courses) ? res.courses : Array.isArray(res) ? res : [];
        setCourses(coursesArr);
      } catch {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [user]);

  const handleQuestionChange = (idx, field, value) => {
    setQuestions((prev) => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions((prev) => prev.map((q, i) => i === qIdx ? { ...q, options: q.options.map((opt, j) => j === optIdx ? value : opt) } : q));
  };

  const addNewQuestion = () => {
    setQuestions((prev) => [...prev, { ...defaultQuestion }]);
  };

  const removeQuestion = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // إنشاء الامتحان أولاً
      const exam = await createExam({ courseId, title, duration });
      // إضافة الأسئلة
      for (const q of questions) {
        await addQuestion(exam._id, q);
      }
      setSuccess("Exam created successfully!");
      setTitle(""); setDuration(60);
      setQuestions([{ ...defaultQuestion }]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error creating exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-create-page" style={{ minHeight: "100vh",background: "#fff"}}>
       <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`exam-create-container ${isSidebarOpen ? "sidebar-open" : ""}`}
        style={{
          maxWidth: 700,
          margin: "40px auto",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0002",
          padding: "32px 24px 24px 24px",
          transition: "margin-left 0.3s",
          minHeight: 600
        }}
      >
       <div className="py-4 logoAuth text-center">
            <motion.h2
              className="fs-4 fw-bold mb-0 mt-3 section-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Create Final Exam For Course
            </motion.h2>
          </div>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Select value={courseId} onChange={e => setCourseId(e.target.value)} required aria-label="Select course">
              <option value="" disabled>Select a course...</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Exam Title</Form.Label>
            <Form.Control
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Final Exam, Midterm, Chapter 1 Quiz..."
              maxLength={100}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              required
              placeholder="e.g. 60"
              style={{ maxWidth: 150 }}
            />
          </Form.Group>
          <h4 className="mt-4 mb-3" style={{ color: "#2d3a4a" }}>Questions</h4>
          {questions.map((q, idx) => (
            <Card className="mb-3" key={idx} style={{ borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontWeight: 600, color: "#3a4a5a" }}>Question {idx + 1}</span>
                  <Button variant="outline-danger" size="sm" onClick={() => removeQuestion(idx)} disabled={questions.length === 1} style={{ fontSize: 13 }}>
                    Remove
                  </Button>
                </div>
                <Form.Group className="mb-2">
                  <Form.Label>Question Text</Form.Label>
                  <Form.Control
                    value={q.text}
                    onChange={e => handleQuestionChange(idx, "text", e.target.value)}
                    required
                    placeholder="Enter the question text..."
                    maxLength={200}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={q.type} onChange={e => handleQuestionChange(idx, "type", e.target.value)}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </Form.Select>
                </Form.Group>
                {q.type === "multiple_choice" && (
                  <div className="mb-2">
                    <Form.Label>Options</Form.Label>
                    {q.options.map((opt, optIdx) => (
                      <Form.Control
                        key={optIdx}
                        className="mb-1"
                        value={opt}
                        onChange={e => handleOptionChange(idx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1} (e.g. Answer ${optIdx + 1})`}
                        required
                        maxLength={100}
                        style={{ marginBottom: 8 }}
                      />
                    ))}
                  </div>
                )}
                <Form.Group className="mb-2">
                  <Form.Label>Correct Answer</Form.Label>
                  <Form.Control
                    value={q.correctAnswer}
                    onChange={e => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                    placeholder={q.type === "true_false" ? "true or false" : "Type the correct answer exactly as one of the options"}
                    required
                    maxLength={100}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
          <Button variant="outline-primary" onClick={addNewQuestion} className="mb-3" style={{ fontWeight: 600, borderRadius: 8 }}>+ Add Question</Button>
          <div className="d-flex justify-content-center mt-4">
            <Button type="submit" disabled={loading} className="me-2" style={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16 }}>
              {loading ? <Spinner size="sm" /> : "Create Exam"}
            </Button>
          </div>
          {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3 text-center">{success}</Alert>}
        </Form>
      </div>
    </div>
  );
};

export default ExamCreate;
