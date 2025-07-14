import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../courses/api/courseApi";
import { Spinner, Button } from "react-bootstrap";
import "../../courses/styles/CourseDetails.css";

const PendingCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/courses/admin/pending-course/${courseId}`
        );
        setCourse(response.data);
      } catch {
        setError("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await axiosInstance.put(`/courses/admin/approve-course/${courseId}`);
      alert("Course approved successfully!");
      navigate("/admin/pending-courses");
    } catch {
      alert("Error approving course.");
    } finally {
      setApproving(false);
    }
  };

  if (loading)
    return (
      <div className="loading-overlay">
        <Spinner />
      </div>
    );
  if (error) return <div className="error-overlay">Error: {error}</div>;
  if (!course) return <div className="not-found-overlay">Course not found</div>;

  return (
    <div className="course-details-page ">
      <div
        style={{
          backgroundColor: "#001c38ff",
         color: "white",
         
        }}
       
      >
        <div style={{
  display: "flex",
          justifyContent: "space-between",
            alignItems: "center",
        }} className="container">

        <h3>Pending</h3>
        
        <div className="approve-button-container  border-2 border-white rounded p-2">
          <Button
           
            onClick={handleApprove}
            disabled={approving}
          >
            {approving ? "Approving..." : "Approve Course"}
          </Button>
        </div>
        </div>
      </div>
      <main className="course-main ">
        <section className="course-banner-section ">
          <div className="banner-content container">
            <div className="banner-text position-relative">
              <h1 className="banner-title">{course.title}</h1>
              <p className="banner-description">{course.description}</p>
              <div className="banner-meta">
                <span className="created-date">
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </span>
                <span className="views">Views: {course.views}</span>
              </div>
            </div>
            <div className="banner-image">
              <img
                src={
                  course.featuredImage ||
                  "https://via.placeholder.com/400x250.png?text=Course+Image"
                }
                alt={course.title}
              />
            </div>
          </div>
        </section>

        <section className="course-section container">
          <h3>What You&apos;ll Learn</h3>
          <ul>
            {course.whatYouWillLearn &&
              course.whatYouWillLearn.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
        </section>

        <section className="course-section container my-5">
          <h3>Course Content</h3>
          {course.sections &&
            course.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section-block">
                <h4>{section.title}</h4>
                <ul>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex}>{lesson.title}</li>
                  ))}
                </ul>
              </div>
            ))}
        </section>

        <section className="course-section container my-5">
          <h3>Target Audience</h3>
          <ul>
            {course.targetAudience &&
              course.targetAudience.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
        </section>

        <section className="course-section container my-5">
          <h3>Tags</h3>
          <div className="tags-list">
            {course.tags &&
              course.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                </span>
              ))}
          </div>
        </section>

        <section className="course-section container my-5">
          <h3>Requirements</h3>
          <ul>
            {course.requirements &&
              course.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
        </section>

      </main>
    </div>
  );
};

export default PendingCourseDetails;
