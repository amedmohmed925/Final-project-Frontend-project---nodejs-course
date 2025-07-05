import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAvailableExamsForStudent } from "../api/examApi";
import { getStudentCompletion } from "../api/studentExamUtils";
import { useSelector, useDispatch } from "react-redux";
import { addCertificate } from "../../student/certificates/certificatesSlice";
import { Spinner, Alert, Card, Button, Container, Row, Col } from "react-bootstrap";
import StudentExamSolve from "./StudentExamSolve";

const StudentExamList = (props) => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completion, setCompletion] = useState(0);
  const [activeExam, setActiveExam] = useState(null);
  const [examStartedAt, setExamStartedAt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const comp = await getStudentCompletion(courseId);
        setCompletion(comp);
        if (comp === 100) {
          const examsList = await getAvailableExamsForStudent(courseId);
          setExams(Array.isArray(examsList) ? examsList : examsList.exams || []);
        } else {
          setExams([]);
        }
      } catch (err) {
        setError(err.message || "Error fetching exams");
      } finally {
        setLoading(false);
      }
    };
    if (courseId && user) fetchData();
  }, [courseId, user]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger" className="shadow-sm text-center" style={{ fontSize: 18 }}>{error}</Alert>
      </Container>
    );
  if (completion < 100)
    return (
      <Container className="py-5">
        <Alert variant="info" className="shadow-sm text-center" style={{ fontSize: 18 }}>
          <i className="bi bi-info-circle-fill me-2" style={{ color: '#0d6efd' }}></i>
          يجب إكمال الكورس بالكامل للوصول إلى الامتحان النهائي.
        </Alert>
      </Container>
    );

  // إصدار الشهادة تلقائياً إذا أكمل الطالب الكورس ولا يوجد امتحان ولم تُصدر الشهادة بعد
  if (completion === 100 && exams.length === 0 && !certificateIssued) {
    setCertificateIssued(true);
    dispatch(addCertificate({ courseId, fileUrl: "" })); // يمكن تعديل fileUrl حسب الحاجة
  }

  if (exams.length === 0)
    return (
      <Container className="py-5">
        <Alert variant="success" className="shadow-sm text-center" style={{ fontSize: 18 }}>
          <i className="bi bi-patch-check-fill me-2" style={{ color: '#28a745' }}></i>
          تم إكمال الكورس بنجاح! تم إصدار شهادتك تلقائيًا ويمكنك تحميلها من صفحة الشهادات.
        </Alert>
      </Container>
    );

  if (activeExam) {
    // حساب الوقت المتبقي
    const durationMs = (activeExam.duration || 60) * 60 * 1000;
    const now = Date.now();
    const started = examStartedAt || now;
    const timeLeft = Math.max(0, durationMs - (now - started));
    const min = Math.floor(timeLeft / 60000);
    const sec = Math.floor((timeLeft % 60000) / 1000);

    // عند انتهاء الوقت، إخفاء الامتحان
    if (timeLeft === 0 && activeExam) {
      setActiveExam(null);
    }

    return (
      <Container className="py-4">
        <Card className="shadow-lg mx-auto" style={{ maxWidth: 600, borderRadius: 18 }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0" style={{ fontWeight: 700, color: '#0d6efd' }}>{activeExam.title}</h4>
              <div style={{ fontWeight: 600, color: timeLeft < 60000 ? 'red' : '#333', fontSize: 18 }}>
                <i className="bi bi-clock-history me-1"></i>
                الوقت المتبقي: {min}:{sec.toString().padStart(2, '0')}
              </div>
            </div>
            <StudentExamSolve examId={activeExam._id} courseId={courseId} onTimeUp={() => setActiveExam(null)} timeLeft={timeLeft} />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // List of available exams
  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h3 style={{ fontWeight: 800, color: '#0d6efd', letterSpacing: 1 }}>الامتحانات المتاحة</h3>
        <p style={{ color: '#555', fontSize: 17 }}>يمكنك بدء الامتحان بعد إكمال الكورس بالكامل.</p>
      </div>
      <Row className="g-4 justify-content-center">
        {exams.map((exam) => (
          <Col key={exam._id} xs={12} md={8} lg={6} xl={5} xxl={4}>
            <Card className="shadow-sm h-100" style={{ borderRadius: 18, border: '1.5px solid #e3e6f0' }}>
              <Card.Body className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-journal-check me-2" style={{ fontSize: 28, color: '#0d6efd' }}></i>
                  <Card.Title className="mb-0" style={{ fontWeight: 700, fontSize: 22 }}>{exam.title}</Card.Title>
                </div>
                <Card.Text className="mb-2" style={{ color: '#666', fontSize: 16 }}>
                  <i className="bi bi-clock me-1"></i> المدة: {exam.duration} دقيقة
                </Card.Text>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-auto w-100"
                  style={{ fontWeight: 600, fontSize: 18, borderRadius: 12, boxShadow: '0 2px 8px #e3e6f0' }}
                  onClick={() => { setActiveExam(exam); setExamStartedAt(Date.now()); }}
                >
                  بدء الامتحان
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StudentExamList;
