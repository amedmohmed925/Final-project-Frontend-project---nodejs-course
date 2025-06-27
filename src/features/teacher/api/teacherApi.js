import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/v1/teacher',
});

// List Students
export const getStudents = async (courseId) => {
  const token = localStorage.getItem('accessToken');
  return api.get('/students', {
    params: { courseId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Remove Student
export const removeStudent = async (courseId, studentId) => {
  const token = localStorage.getItem('accessToken');
  return api.delete('/students', {
    data: { courseId, studentId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get Student Progress
export const getStudentProgress = async (courseId, studentId) => {
  const token = localStorage.getItem('accessToken');
  return api.get('/students/progress', {
    params: { courseId, studentId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get Course Progress Stats
export const getCourseProgress = async (courseId) => {
  const token = localStorage.getItem('accessToken');
  return api.get('/progress', {
    params: { courseId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// List Course Feedbacks
export const listCourseFeedbacks = async (courseId) => {
  const token = localStorage.getItem('accessToken');
  return api.get('/feedbacks', {
    params: { courseId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Reply to Feedback
export const replyToFeedback = async (feedbackId, reply) => {
  const token = localStorage.getItem('accessToken');
  return api.post(`/feedbacks/${feedbackId}/reply`, { reply }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Toggle Feedback Visibility
export const toggleFeedbackVisibility = async (feedbackId) => {
  const token = localStorage.getItem('accessToken');
  return api.patch(`/feedbacks/${feedbackId}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};