// api/axiosInstance.js
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor لإضافة التوكن في كل طلب
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

// Interceptor للتعامل مع انتهاء التوكن
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:8080/auth/refresh-token', {
          refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // لو الـ refreshToken نفسه منتهي أو غير صالح
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // إعادة توجيه لتسجيل الدخول
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const addCourse = async (courseData) => {
  try {
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('price', courseData.price);
    formData.append('level', courseData.level);
    formData.append('category', courseData.category);
    formData.append('resources', JSON.stringify(courseData.resources));
    formData.append('tags', JSON.stringify(courseData.tags || []));

    if (courseData.featuredImage) {
      formData.append('featuredImage', courseData.featuredImage);
    }

    // إضافة الأقسام مع الحلقات
    courseData.sections.forEach((section, sectionIndex) => {
      const sectionData = {
        title: section.title,
        lessons: section.lessons.map((lesson) => ({
          title: lesson.title,
          content: lesson.content,
          quiz: lesson.quiz || '',
        })),
      };
      formData.append('sections', JSON.stringify(sectionData));

      // إضافة الفيديوهات والصور المصغرة لكل حلقة
      section.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.video) {
          formData.append('lessonVideos', lesson.video);
        }
        if (lesson.thumbnail) {
          formData.append('lessonThumbnails', lesson.thumbnail);
        }
      });
    });

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

export const updateCourse = async (courseId, courseData) => {
  try {
    const formData = new FormData();
    console.log("Sending to URL:", `/courses/${courseId}`); // تحقق من المسار
    console.log("Course Data Title:", courseData.title); // تحقق من القيمة قبل الإرسال
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("price", courseData.price);
    formData.append("level", courseData.level);
    formData.append("category", courseData.category);
    formData.append("resources", JSON.stringify(courseData.resources));
    formData.append("tags", JSON.stringify(courseData.tags || []));

    if (courseData.featuredImage) {
      formData.append("featuredImage", courseData.featuredImage);
    }

    // إضافة الأقسام مع الحلقات
    courseData.sections.forEach((section) => {
      const sectionData = {
        title: section.title,
        lessons: section.lessons.map((lesson) => ({
          title: lesson.title,
          content: lesson.content,
          quiz: lesson.quiz || "",
          videoUrl: lesson.videoUrl || "", // الاحتفاظ برابط الفيديو القديم إذا لم يتم تحديثه
          thumbnailUrl: lesson.thumbnailUrl || "", // الاحتفاظ برابط الصورة المصغرة القديم إذا لم يتم تحديثه
        })),
      };
      formData.append("sections", JSON.stringify(sectionData));

      section.lessons.forEach((lesson) => {
        if (lesson.video) {
          formData.append("lessonVideos", lesson.video);
        }
        if (lesson.thumbnail) {
          formData.append("lessonThumbnails", lesson.thumbnail);
        }
      });
    });

    const response = await axiosInstance.put(`/courses/${courseId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update course");
    } else if (error.request) {
      throw new Error("No response from the server");
    } else {
      throw new Error(error.message || "Something went wrong");
    }
  } }

export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get('/courses');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch courses');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch course');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};