import axios from "axios";

const API_URL = 'http://localhost:8080/api/v1/users';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});
// Fetch all verified instructors
export const getVerifiedTeachers = async () => {
  const res = await axios.get(`${API_URL}/teachers/verified`, { headers: getAuthHeaders() });
  return res.data.teachers;
};

// Fetch details of a specific instructor
export const getTeacherDetails = async (id) => {
  const res = await axios.get(`${API_URL}/teacher/${id}/details`, { headers: getAuthHeaders() });
  return {
    teacher: res.data.teacher,
    courses: res.data.courses,
  };
};

