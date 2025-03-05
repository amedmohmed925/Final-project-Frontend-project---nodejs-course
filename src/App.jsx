

import {  Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/navbar/Header";
import Login from "./auth/Login"
import Register from "./auth/Register"
import Courses from "./pages/Courses/Courses";
import Home from "./pages/Home/Home";
import Profile from "./user/Profile/Profile";
import UpdateInfo from "./user/UpdateInfo/UpdateInfo";
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;

