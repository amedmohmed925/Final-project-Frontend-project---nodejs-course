import { useState, useEffect } from "react";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getFeedbacksByCourseId, addFeedback, deleteFeedback, updateFeedback } from "../../api/feedbackApi";
import "../../styles/FeedbackCourse.css";

const FeedbackSection = ({ courseId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ comment: "", rating: 0 });
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (courseId) fetchFeedbacks();
  }, [courseId, refresh]);

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
    if (editingFeedback) {
      setEditingFeedback({ ...editingFeedback, rating });
    } else {
      setNewFeedback({ ...newFeedback, rating });
    }
  };

  const handleCommentChange = (e) => {
    if (editingFeedback) {
      setEditingFeedback({ ...editingFeedback, comment: e.target.value });
    } else {
      setNewFeedback({ ...newFeedback, comment: e.target.value });
    }
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
        console.log("Updated Feedback from API:", updatedFeedback);
        setEditingFeedback(null);
        setNewFeedback({ comment: "", rating: 0 });
        setRefresh(!refresh);
      } else {
        const feedbackData = { ...newFeedback, courseId };
        const addedFeedback = await addFeedback(feedbackData);
        console.log("Added Feedback from API:", addedFeedback);
        setNewFeedback({ comment: "", rating: 0 });
        setRefresh(!refresh);
      }
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
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error deleting feedback:", err.message);
    }
  };

  const renderStars = (rating, isEditable = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= rating ? "star filled" : "star"}
        onClick={isEditable ? () => handleRating(star) : null}
        style={{ cursor: isEditable ? "pointer" : "default" }}
      />
    ));
  };

  const getUserName = (feedback) => {
    if (user && feedback.userId === user._id) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous";
    }
    if (feedback.userId && typeof feedback.userId === "object") {
      return `${feedback.userId.firstName || ""} ${feedback.userId.lastName || ""}`.trim() || "Anonymous";
    }
    return "Anonymous";
  };

  const getUserImage = (feedback) => {
    if (user && feedback.userId === user._id && user.profileImage) {
      return user.profileImage;
    }
    if (feedback.userId && typeof feedback.userId === "object" && feedback.userId.profileImage) {
      return feedback.userId.profileImage;
    }
    // التحقق من user قبل استخدام user.profileImage
    return (user && user.profileImage) || "https://courssat.com/assets/images/home/avatar.png";
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
              <p className="no-feedback">No feedback yet. Be the first to share your thoughts!</p>
            ) : (
              feedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-item">
                  <div className="feedback-user-info">
                    <img
                      className="imageFeebackUser"
                      src={getUserImage(feedback)}
                      alt={getUserName(feedback)}
                    />
                    <div className="feedback-user-details">
                      <span className="feedback-user">{getUserName(feedback)}</span>
                      <div className="feedback-stars">{renderStars(feedback.rating)}</div>
                    </div>
                  </div>
                  <p className="feedback-comment">{feedback.comment}</p>
                  {user && user._id === (feedback.userId?._id || feedback.userId) && (
                    <div className="feedback-actions">
                      <button className="feedback-action-icon" onClick={() => handleEdit(feedback)}>
                        <FaEdit />
                      </button>
                      <button className="feedback-action-icon" onClick={() => handleDelete(feedback._id)}>
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
              value={editingFeedback ? editingFeedback.comment : newFeedback.comment}
              onChange={handleCommentChange}
              placeholder="Share your thoughts about this course..."
              required
            />
            <div className="rating-section">
              <span>Rate this course:</span>
              <div className="stars">
                {renderStars(editingFeedback ? editingFeedback.rating : newFeedback.rating, true)}
              </div>
            </div>
            <button type="submit" className="btn">
              {editingFeedback ? "Update Feedback" : "Submit Feedback"}
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default FeedbackSection;