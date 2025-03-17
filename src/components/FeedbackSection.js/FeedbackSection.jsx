// src/components/FeedbackSection.jsx
import { useState, useEffect } from "react";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getFeedbacksByCourseId, addFeedback, deleteFeedback, updateFeedback } from "../../api/feedbackApi";
import "../../styles/CourseDetails.css";

const FeedbackSection = ({ courseId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ comment: "", rating: 0 });
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user); // Adjust based on your Redux store

  useEffect(() => {
    if (courseId) fetchFeedbacks();
  }, [courseId]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getFeedbacksByCourseId(courseId);
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedback:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (rating) => {
    setNewFeedback({ ...newFeedback, rating });
    if (editingFeedback) setEditingFeedback({ ...editingFeedback, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit feedback.");
      return;
    }

    try {
      if (editingFeedback) {
        const updatedFeedback = await updateFeedback(editingFeedback._id, {
          comment: editingFeedback.comment,
          rating: editingFeedback.rating,
        });
        setFeedbacks(feedbacks.map((f) => (f._id === updatedFeedback._id ? updatedFeedback : f)));
        setEditingFeedback(null);
      } else {
        const feedbackData = { ...newFeedback, courseId };
        const addedFeedback = await addFeedback(feedbackData);
        setFeedbacks([...feedbacks, addedFeedback]);
      }
      setNewFeedback({ comment: "", rating: 0 });
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setNewFeedback({ comment: feedback.comment, rating: feedback.rating });
  };

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
      setFeedbacks(feedbacks.filter((f) => f._id !== feedbackId));
    } catch (err) {
      console.error("Error deleting feedback:", err.message);
    }
  };

  const renderStars = (rating, isEditable = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= rating ? "star active" : "star"}
        onClick={isEditable ? () => handleRating(star) : null}
        style={{ cursor: isEditable ? "pointer" : "default" }}
      />
    ));
  };

  return (
    <section className="course-section feedback-section">
      <h3>Student Feedback</h3>
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>Loading feedback...
        </div>
      ) : (
        <>
          <div className="feedback-list">
            {feedbacks.length === 0 ? (
              <p>No feedback yet. Be the first to share your thoughts!</p>
            ) : (
              feedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-item">
                  <div className="feedback-header">
                    {/* Display firstName and lastName instead of username */}
                    <span className="feedback-user">
                      {feedback.userId && feedback.userId.firstName && feedback.userId.lastName
                        ? `${feedback.userId.firstName} ${feedback.userId.lastName}`
                        : "Anonymous"}
                    </span>
                    <div className="feedback-stars">{renderStars(feedback.rating)}</div>
                  </div>
                  <p className="feedback-comment">{feedback.comment}</p>
                  {user && user._id === feedback.userId?._id && (
                    <div className="feedback-actions">
                      <button className="action-icon" onClick={() => handleEdit(feedback)}>
                        <FaEdit />
                      </button>
                      <button className="action-icon" onClick={() => handleDelete(feedback._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form className="feedback-form" onSubmit={handleSubmit}>
            <h4>{editingFeedback ? "Edit Your Feedback" : "Add Your Feedback"}</h4>
            <textarea
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
              placeholder="Share your thoughts about this course..."
              required
            />
            <div className="rating-section">
              <span>Rate this course:</span>
              <div className="stars">{renderStars(newFeedback.rating, true)}</div>
            </div>
            <button type="submit" className="enroll-sticky-btn">
              {editingFeedback ? "Update Feedback" : "Submit Feedback"}
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default FeedbackSection;