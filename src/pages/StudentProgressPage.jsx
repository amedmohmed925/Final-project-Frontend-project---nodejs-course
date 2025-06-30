import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Moved to student folder

const StudentProgressPage = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [examStatus, setExamStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getAllProgress();
        setProgressList(data);
        // Check exam status for each course
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

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}><Spinner /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafd' }}>
      <SidebarProfile isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, marginLeft: 0, padding: '0 0 0 0' }}>
        <Container className="py-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="mb-0" style={{ fontWeight: 800, color: '#0d6efd' }}>My Learning Progress</h2>
            <button className="btn btn-outline-primary" onClick={() => setSidebarOpen(true)}>
              Open Sidebar
            </button>
          </div>
          {progressList.length === 0 ? (
            <Alert variant="info" className="text-center">No enrolled courses yet.</Alert>
          ) : (
            <Row className="g-4 justify-content-center">
              {progressList.map((progress) => {
                const percent = progress.completionPercentage;
                const isCompleted = percent === 100;
                const takenExam = examStatus[progress.courseId._id];
                const image = progress.courseId.featuredImage || "https://via.placeholder.com/400x250.png?text=Course+Image";
                const handleClick = async () => {
                  if (isCompleted) {
                    if (takenExam) {
                      alert("You have already taken the final exam for this course.");
                    } else {
                      // Get available exams for this course
                      const exams = await getAvailableExamsForStudent(progress.courseId._id);
                      if (exams && exams.length > 0) {
                        // Go to the first available exam
                        navigate(`/course/${progress.courseId._id}/exams`);
                      } else {
                        alert("No exam available for this course.");
                      }
                    }
                  } else {
                    // Get first unwatched lesson
                    const lesson = await getFirstUnwatchedLesson(progress.courseId._id);
                    if (lesson) {
                      navigate(`/course/${progress.courseId._id}/section/${lesson.sectionIndex}/lesson/${lesson.lessonIndex}`);
                    } else {
                      alert("All lessons are completed!");
                    }
                  }
                };
                return (
                  <Col key={progress.courseId._id} xs={12} md={8} lg={6} xl={5} xxl={4}>
                    <Card className="shadow-sm h-100" style={{ borderRadius: 16, cursor: 'pointer', transition: 'box-shadow 0.2s', border: isCompleted ? '2px solid #28a745' : '1.5px solid #e3e6f0' }} onClick={handleClick}>
                      <Image src={image} alt={progress.courseId.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                      <Card.Body>
                        <Card.Title style={{ fontWeight: 700, fontSize: 20 }}>{progress.courseId.title}</Card.Title>
                        <div className="mb-2" style={{ color: '#666', fontSize: 15 }}>
                          Progress: <span style={{ fontWeight: 600, color: isCompleted ? '#28a745' : '#0d6efd' }}>{percent.toFixed(0)}%</span>
                        </div>
                        <ProgressBar now={percent} label={`${percent.toFixed(0)}%`} style={{ height: 12, borderRadius: 8, background: '#e9ecef' }} variant={isCompleted ? 'success' : 'primary'} />
                        {isCompleted && takenExam && (
                          <div className="mt-2 text-success" style={{ fontWeight: 600 }}>
                            <i className="bi bi-check-circle-fill me-2"></i>Exam already taken
                          </div>
                        )}
                        {isCompleted && !takenExam && (
                          <div className="mt-2 text-primary" style={{ fontWeight: 600 }}>
                            <i className="bi bi-clipboard-check me-2"></i>Click to take the final exam
                          </div>
                        )}
                        {!isCompleted && (
                          <div className="mt-2 text-info" style={{ fontWeight: 600 }}>
                            <i className="bi bi-play-circle me-2"></i>Click to continue learning
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
