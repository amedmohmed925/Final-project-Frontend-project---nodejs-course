// احضر جميع كورسات المعلم الحالي
import axiosInstance from "../../courses/api/courseApi";

export const getMyCourses = async () => {
  // يعتمد على أن الباك اند يحدد المعلم من التوكن
  const response = await axiosInstance.get("/courses/my");
  return response.data;
};
