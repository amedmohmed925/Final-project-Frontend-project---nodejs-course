

import {  Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/navbar/Header";
import Login from "./auth/Login"
import Register from "./auth/Register"
import Courses from "./pages/Courses/Courses";
import Home from "./pages/Home/Home";
import Profile from "./components/Profile/Profile";
const App = () => {
  return (
    <Router>
      <Header />
      <Container className="mt-4 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

