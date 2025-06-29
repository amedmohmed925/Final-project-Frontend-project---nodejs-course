import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/v1/exams",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// إنشاء امتحان جديد (بدون startTime و endTime)
export const createExam = async (examData) => {
  // examData: { courseId, title, duration }
  const { courseId, title, duration } = examData;
  const response = await api.post("/teacher", { courseId, title, duration });
  return response.data;
};

// إضافة سؤال للامتحان
export const addQuestion = async (examId, questionData) => {
  const response = await api.post(`/teacher/${examId}/questions`, questionData);
  return response.data;
};

// جلب نتائج الطلاب في امتحان
export const getExamResults = async (examId) => {
  const response = await api.get(`/teacher/${examId}/results`);
  return response.data;
};

// جلب الامتحانات المتاحة للطالب في كورس
export const getAvailableExamsForStudent = async (courseId) => {
  const response = await api.get(`/student`, { params: { courseId } });
  return response.data;
};

// جلب أسئلة الامتحان للطالب
export const getExamQuestionsForStudent = async (examId) => {
  const response = await api.get(`/student/${examId}/questions`);
  return response.data;
};

// حل الامتحان
export const submitExam = async (examId, answers) => {
  const response = await api.post(`/student/${examId}/submit`, { answers });
  return response.data;
};
