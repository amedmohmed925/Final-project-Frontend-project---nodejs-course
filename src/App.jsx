
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/navbar/Header";
import Login from "./auth/Login"
import Register from "./auth/Register"
import Courses from "./pages/Courses/Courses";
import Home from "./pages/Home/Home";
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
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

