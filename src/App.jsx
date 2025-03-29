
import {  Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/navbar/Header";
import Login from "./auth/Login"
import Register from "./auth/Register"
import Courses from "./pages/Courses/Courses";
import Home from "./pages/Home/Home";
import Profile from "./user/Profile/Profile";
import UpdateInfo from "./user/UpdateInfo/UpdateInfo";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import AllUsers from "./user/AllUsers/AllUsers";
import AddCourse from "./components/coureses/AddCourse";
import CourseDetails from "./components/coureses/CourseDetails";
import EditCourse from "./components/coureses/EditCourse";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCart } from "./features/cart/cartSlice";
import AdvertiserDashboard from "./pages/AdvertiserDashboard/AdvertiserDashboard"
import AdminCouponReport from "./pages/AdminCouponReport/AdminCouponReport"
import Community from "./pages/Community/Community";
import ContactPage from "./pages/ContactPage/ContactPage";
import Footer from "./components/Footer";
import LessonPage from "./components/coureses/LessonPage"; // Fixed typo in folder name
import CategoryManager from "./components/CategoryManager.js/CategoryManager";
import TeacherCourses from "./components/coureses/TeacherCourses";
import AdminNotificationSender from "./components/AdminNotificationSender/AdminNotificationSender";
import CategoryCourses from "./components/coureses/CategoryCourses";
import SearchResults from "./components/SearchResults/SearchResults";
const App = () => {

 

  return (
    <Router>
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
        </Routes>
            <Footer />
        
      </div>
    </Router>
  );
};

export default App;

