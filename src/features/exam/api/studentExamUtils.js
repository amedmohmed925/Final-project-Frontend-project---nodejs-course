import { getAllProgress } from "../../courseProgress/api/courseProgressApi";
import * as examApi from "./examApi";

// جلب نسبة التقدم للطالب في كورس معين
export const getStudentCompletion = async (courseId) => {
  const progressList = await getAllProgress();
  console.log("[getStudentCompletion] progressList:", progressList);
  console.log("[getStudentCompletion] courseId:", courseId, typeof courseId);
  const progress = progressList.find((p) => {
    console.log("[getStudentCompletion] checking:", p.courseId, typeof p.courseId, p.courseId?._id);
    return p.courseId?._id === courseId || p.courseId === courseId;
  });
  console.log("[getStudentCompletion] found progress:", progress);
  return progress ? progress.completionPercentage : 0;
};

// Check if student has already taken the exam for a course
export const hasStudentTakenExam = async (courseId) => {
  try {
    const response = await examApi.default.get(`/student/exam-status`, { params: { courseId } });
    return response.data?.taken || false;
  } catch (err) {
    return false;
  }
};

// Get the first unwatched lesson for a course
import axios from "axios";
export const getFirstUnwatchedLesson = async (courseId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `/v1/course-progress/unwatched-lesson`,
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
