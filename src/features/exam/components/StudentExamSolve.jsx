import { useEffect, useState, useRef } from "react";
import { getExamQuestionsForStudent, submitExam } from "../api/examApi";
import { getStudentCompletion } from "../api/studentExamUtils";
import { Spinner, Button, Card, Form, Modal, Alert } from "react-bootstrap";

const StudentExamSolve = ({ examId, courseId, onTimeUp }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // success | error
  const [completion, setCompletion] = useState(0);
  const [duration, setDuration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const comp = await getStudentCompletion(courseId);
        setCompletion(comp);
        if (comp === 100) {
          const data = await getExamQuestionsForStudent(examId);
          setQuestions(data.questions || []);
          setDuration(data.duration || null);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError(err.message || "Error fetching questions");
      } finally {
        setLoading(false);
      }
    };
    if (examId && courseId) fetchData();
  }, [examId, courseId]);

  // Timer logic
  useEffect(() => {
    if (!duration) return;
    const endTime = Date.now() + duration * 60 * 1000;
    timerRef.current = endTime;
    const interval = setInterval(() => {
      const left = Math.max(0, endTime - Date.now());
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
        if (onTimeUp) onTimeUp();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [duration, onTimeUp]);

  // Timer: call onTimeUp when timeLeft hits 0
  useEffect(() => {
    if (!timeLeft || !onTimeUp) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    timerRef.current = setTimeout(() => {
      if (timeLeft - 1000 <= 0) onTimeUp();
    }, timeLeft);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, onTimeUp]);

  // تغيير الإجابة فقط في الواجهة
  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const answerArr = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const res = await submitExam(examId, answerArr);
      setSuccess(`Exam submitted! Your score: ${res.score} / ${res.total}`);
      setModalType("success");
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error submitting exam");
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return (
    <Modal show onHide={() => setError("")}> <Modal.Header closeButton><Modal.Title>Error</Modal.Title></Modal.Header>
      <Modal.Body>{error}</Modal.Body>
      <Modal.Footer><Button variant="secondary" onClick={() => setError("")}>Close</Button></Modal.Footer>
    </Modal>
  );
  if (completion < 100)
    return <Alert variant="info">You must complete the course to access the exam.</Alert>;
  if (questions.length === 0)
    return <Alert variant="warning">No questions available for this exam.</Alert>;

  // حساب الوقت المتبقي
  let min = null, sec = null;
  if (timeLeft !== null) {
    min = Math.floor(timeLeft / 60000);
    sec = Math.floor((timeLeft % 60000) / 1000);
  }

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: "0 auto" }}>
      <h4 style={{ textAlign: "center", marginBottom: 24 }}>Exam Questions</h4>
      {duration && timeLeft !== null && (
        <div style={{ textAlign: "center", fontWeight: 600, color: timeLeft < 60000 ? 'red' : '#333', marginBottom: 18, fontSize: 18 }}>
          Time Left: {min}:{sec !== null ? sec.toString().padStart(2, '0') : ''}
        </div>
      )}
      {questions.map((q, idx) => (
        <Card className="mb-3" key={q._id} style={{ borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
          <Card.Body>
            <Card.Title>{idx + 1}. {q.text}</Card.Title>
            {q.type === "multiple_choice" ? (
              q.options.map((opt, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  label={opt}
                  name={`q_${q._id}`}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => handleChange(q._id, opt)}
                />
              ))
            ) : (
              ["صح", "خطأ"].map((val) => (
                <Form.Check
                  key={val}
                  type="radio"
                  label={val}
                  name={`q_${q._id}`}
                  value={val}
                  checked={answers[q._id] === val}
                  onChange={() => handleChange(q._id, val)}
                />
              ))
            )}
          </Card.Body>
        </Card>
      ))}
      <div style={{ textAlign: "center" }}>
        <Button type="submit" variant="primary" disabled={loading} style={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16 }}>
          {loading ? "Submitting..." : "Submit Exam"}
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "success" ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "success" ? success : error}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

export default StudentExamSolve;
