// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // العنوان الأساسي
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة Interceptor لإضافة التوكن تلقائيًا
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

export const addCourse = async (courseData) => {
  try {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('lessons', JSON.stringify(courseData.lessons));
    formData.append('quizzes', JSON.stringify(courseData.quizzes || []));
    formData.append('resources', JSON.stringify(courseData.resources || []));
    formData.append('tags', JSON.stringify(courseData.tags || []));

    if (courseData.featuredImage) {
      formData.append('featuredImage', courseData.featuredImage);
    }

    if (courseData.lessonVideos && courseData.lessonVideos.length > 0) {
      courseData.lessonVideos.forEach((video) => {
        formData.append('lessonVideos', video);
      });
    }

    const response = await axiosInstance.post('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to add course');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};