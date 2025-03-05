import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/Header.css";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false); // حالة لتتبع التمرير

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        const heroSectionHeight = heroSection.offsetHeight; // ارتفاع الـ Hero Section
        if (window.scrollY > heroSectionHeight) {
          setIsScrolled(true); // إذا تم التمرير بعد الـ Hero Section
        } else {
          setIsScrolled(false); // إذا كان التمرير داخل الـ Hero Section
        }
      }
    };

    window.addEventListener("scroll", handleScroll); // استمع لحدث التمرير
    return () => {
      window.removeEventListener("scroll", handleScroll); // نظف الحدث عند إلغاء التحميل
    };
  }, []);

  return (
    <Navbar
      bg={isHomePage && !isScrolled ? "transparent" : "dark"} // إذا كانت الصفحة هي Home ولم يتم التمرير بعد الـ Hero Section، اجعل الخلفية شفافة
      variant={isHomePage && !isScrolled ? "light" : "dark"} // إذا كانت الصفحة هي Home ولم يتم التمرير بعد الـ Hero Section، استخدم لون نص فاتح
      expand="lg"
      className={isHomePage && !isScrolled ? "header-transparent" : ""} // إضافة كلاس خاص لـ Home
      fixed="top" // لجعل الـ Header ثابتًا في أعلى الصفحة
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
        <h1 className="text-light logo">
  <span className="logo-part-1">Cour</span>
  <span className="logo-part-2">ses</span>
</h1>        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/courses">
              Courses
            </Nav.Link>

            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as={Nav.Link}
                  className="d-flex align-items-center"
                  style={{ color: isHomePage && !isScrolled ? "white" : "white" }} // تغيير لون النص إذا كانت الصفحة هي Home ولم يتم التمرير بعد الـ Hero Section
                >
                  <FaUserCircle size={20} className="me-2" />
                  {user.username}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;