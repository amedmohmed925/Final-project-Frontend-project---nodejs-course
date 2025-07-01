import {
  fetchStudentProgress,
  fetchFirstUnwatchedLesson,
} from "../api/studentProgressApi";
import { getAvailableExamsForStudent } from "../../exam/api/examApi";
import { hasStudentTakenExam } from "../../exam/api/studentExamUtils";
import {
  Card,
  ProgressBar,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SidebarProfile from "../../user/components/SidebarProfile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StudentProgressPage = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [examStatus, setExamStatus] = useState({});
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await fetchStudentProgress();
        setProgressList(data);
        const statusObj = {};
        for (const progress of data) {
          const taken = await hasStudentTakenExam(progress.courseId._id);
          statusObj[progress.courseId._id] = taken;
        }
        setExamStatus(statusObj);
      } catch (err) {
        setError("Failed to fetch progress data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 200 }}
      >
        <Spinner />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7fafd" }}>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${
          isSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div  className="my-4" style={{ flex: 1, marginLeft: 0, padding: "0 0 0 0" }}>
          <motion.h2
            className="fs-4 fw-bold mb-0 mt-3 section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Learning Progress
          </motion.h2>
        <Container className="my-4">

          {progressList.length === 0 ? (
            <Alert variant="info" className="text-center">
              No enrolled courses yet.
            </Alert>
          ) : (
            <Row className="g-4 justify-content-center">
              {progressList.map((progress) => {
                const percent = progress.completionPercentage;
                const isCompleted = percent === 100;
                const takenExam = examStatus[progress.courseId._id];
                const image =
                  progress.courseId.featuredImage ||
                  "https://via.placeholder.com/400x250.png?text=Course+Image";
                const handleClick = async () => {
                  if (isCompleted) {
                    if (takenExam) {
                      alert(
                        "You have already taken the final exam for this course."
                      );
                    } else {
                      const exams = await getAvailableExamsForStudent(
                        progress.courseId._id
                      );
                      if (exams && exams.length > 0) {
                        navigate(`/course/${progress.courseId._id}/exams`);
                      } else {
                        alert("No exam available for this course.");
                      }
                    }
                  } else {
                    const lesson = await fetchFirstUnwatchedLesson(
                      progress.courseId._id
                    );
                    if (lesson) {
                      navigate(
                        `/course/${progress.courseId._id}/section/${lesson.sectionIndex}/lesson/${lesson.lessonIndex}`
                      );
                    } else {
                      alert("All lessons are completed!");
                    }
                  }
                };
                return (
                  <Col
                    key={progress.courseId._id}
                    xs={12}
                    md={8}
                    lg={6}
                    xl={5}
                    xxl={4}
                  >
                    <Card
                      className="shadow-sm h-100"
                      style={{
                        borderRadius: 16,
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                        border: isCompleted
                          ? "2px solid #28a745"
                          : "1.5px solid #e3e6f0",
                      }}
                      onClick={handleClick}
                    >
                      <Image
                        src={image}
                        alt={progress.courseId.title}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      />
                      <Card.Body>
                        <Card.Title style={{ fontWeight: 700, fontSize: 20 }}>
                          {progress.courseId.title}
                        </Card.Title>
                        <div
                          className="mb-2"
                          style={{ color: "#666", fontSize: 15 }}
                        >
                          Progress:{" "}
                          <span
                            style={{
                              fontWeight: 600,
                              color: isCompleted ? "#28a745" : "#0d6efd",
                            }}
                          >
                            {percent.toFixed(0)}%
                          </span>
                        </div>
                        <ProgressBar
                          now={percent}
                          label={`${percent.toFixed(0)}%`}
                          style={{
                            height: 12,
                            borderRadius: 8,
                            background: "#e9ecef",
                          }}
                          variant={isCompleted ? "success" : "primary"}
                        />
                        {isCompleted && takenExam && (
                          <div
                            className="mt-2 text-success"
                            style={{ fontWeight: 600 }}
                          >
                            <i className="bi bi-check-circle-fill me-2"></i>Exam
                            already taken
                          </div>
                        )}
                        {isCompleted && !takenExam && (
                          <div
                            className="mt-2 text-primary"
                            style={{ fontWeight: 600 }}
                          >
                            <i className="bi bi-clipboard-check me-2"></i>Click
                            to take the final exam
                          </div>
                        )}
                        {!isCompleted && (
                          <div
                            className="mt-2 text-info"
                            style={{ fontWeight: 600 }}
                          >
                            <i className="bi bi-play-circle me-2"></i>Click to
                            continue learning
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default StudentProgressPage;
