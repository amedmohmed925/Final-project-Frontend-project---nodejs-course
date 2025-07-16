import { getAllProgress } from "../../courseProgress/api/courseProgressApi";
import axios from "axios";

export const fetchStudentProgress = async () => {
  return await getAllProgress();
};

export const fetchFirstUnwatchedLesson = async (courseId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      "http://localhost:8080/api/v1/course-progress/unwatched-lesson",
      {
        params: { courseId },
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      }
    );
    return response.data?.lesson || null;
  } catch (err) {
    return null;
  }
};
