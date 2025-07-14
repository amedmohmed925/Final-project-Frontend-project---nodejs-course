import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./shared/components/Header";
import Login from "./features/auth/components/Login";
import Register from "./features/auth/components/Register";
import Courses from "./features/courses/pages/Courses";
import Home from "./pages/Home/Home";
import Profile from "./features/user/components/Profile";
import UpdateInfo from "./features/user/components/UpdateInfo";
import ForgotPassword from "./features/auth/components/ForgotPassword";
import ResetPassword from "./features/auth/components/ResetPassword";
import AdminAllUsers from "./features/admin/components/UserTable";
import AddCourse from "./features/courses/components/AddCourse";
import CourseDetails from "./features/courses/components/CourseDetails";
import EditCourse from "./features/courses/components/EditCourse";
import About from "./pages/About";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCart } from "./features/cart/cartSlice";
import AdvertiserDashboard from "./features/advertiser/components/AdvertiserDashboard";
import AdminCouponReport from "./features/coupon/components/AdminCouponReport";
import Community from "./features/community/components/Community";
import ContactPage from "./pages/ContactPage";
import Footer from "./shared/components/Footer";
import LessonPage from "./features/courses/components/LessonPage";
import CategoryManager from "./features/category/components/CategoryManager";
import TeacherCourses from "./features/courses/components/TeacherCourses";
import AdminNotificationSender from "./features/notifications/components/AdminNotificationSender";
import CategoryCourses from "./features/courses/components/CategoryCourses";
import SearchResults from "./features/search/components/SearchResults";
import TeacherProfile from "./features/teacher/components/TeacherProfile";
import Chat from "./features/chat/components/Chat";
import StudentManager from "./features/teacher/components/StudentManager";
import PurchasedCourses from "./features/student/components/PurchasedCourses";
import FeedbackManager from "./features/teacher/components/FeedbackManager";
import ExamCreate from "./features/exam/components/ExamCreate";
import PendingCourses from "./features/admin/pages/PendingCourses";
import PendingCourseDetails from "./features/admin/pages/PendingCourseDetails";

import AdminDashboard from "./features/admin/components/AdminDashboard";
import AdminTeachers from "./features/admin/components/AdminTeachers";
import AdminStudents from "./features/admin/components/AdminStudents";
import AdminLogs from "./features/admin/logss";
import AdminPayments from "./features/admin/payment";

import StudentFavoritesRoute from "./routes/StudentFavoritesRoute";
import CertificatesList from "./features/student/certificates/CertificatesList";
import StudentExamList from "./features/exam/components/StudentExamList";
import StudentProgressPage from "./features/student/components/StudentProgressPage";

const App = () => {
  const location = useLocation();
  const noFooterPaths = [
    "/register",
    "/login", 
    "/profile",
    "/forgotPassword",
    "/reset-password",
    "/AdminNotificationSender",
    "/update-info",
    "/AdminCouponReport",
    "/all-users",
    "/CategoryManager",
  ];

  const showFooter = !noFooterPaths.includes(location.pathname);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/About" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-info" element={<UpdateInfo />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/all-users" element={<AdminAllUsers />} />
        <Route path="/admin/users" element={<AdminAllUsers />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/course/:courseId/section/:sectionIndex/lesson/:lessonIndex" element={<LessonPage />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        <Route path="/AdvertiserDashboard" element={<AdvertiserDashboard />} />
        <Route path="/AdminCouponReport" element={<AdminCouponReport />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/CategoryManager" element={<CategoryManager />} />
        <Route path="/CoursesTeacher" element={<TeacherCourses />} />
        <Route path="/AdminNotificationSender" element={<AdminNotificationSender />} />
        <Route path="/categories/:categoryId" element={<CategoryCourses />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/chat/live" element={<Chat />} />
        <Route path="/chat/bot" element={<Chat />} />
        <Route path="/teacher/:teacherId" element={<TeacherProfile />} />
        <Route path="/teacher/students-manager" element={<StudentManager />} />
        <Route path="/student/purchased-courses" element={<PurchasedCourses />} />
        <Route path="/teacher/feedbacks" element={<FeedbackManager />} />
        <Route path="/teacher/exams/create" element={<ExamCreate />} />
        <Route path="/course/:courseId/exams" element={<StudentExamList />} />
        <Route path="/student/progress" element={<StudentProgressPage />} />
        <Route path="/student/favorites" element={<StudentFavoritesRoute />} />
        <Route path="/student/certificates" element={<CertificatesList />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/teachers" element={<AdminTeachers />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/pending-courses" element={<PendingCourses />} />
        <Route path="/admin/pending-courses/:courseId" element={<PendingCourseDetails />} />
      </Routes>
      {showFooter && <Footer />} 
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;