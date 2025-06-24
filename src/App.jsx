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
import AllUsers from "./features/user/components/AllUsers";
import AddCourse from "./features/courses/components/AddCourse";
import CourseDetails from "./features/courses/components/CourseDetails";
import EditCourse from "./features/courses/components/EditCourse";
import Blog from "./pages/Blog"
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
import StudentManager from "./components/StudentManager";

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
        <Route path="/blog" element={<Blog />} />
        <Route path="/About" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-info" element={<UpdateInfo />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/all-users" element={<AllUsers />} />
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