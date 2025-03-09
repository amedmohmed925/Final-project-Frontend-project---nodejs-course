

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
const App = () => {
  return (
    <Router>
      <div>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-info" element={<UpdateInfo />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

