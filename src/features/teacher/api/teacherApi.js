import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/v1/teacher',
});

// List Students
export const getStudents = async (courseId) => {
  const token = localStorage.getItem('accessToken');
  console.log(token)
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