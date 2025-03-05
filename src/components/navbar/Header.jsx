import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";

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
      bg={isHomePage && !isScrolled ? "transparent" : "dark"}
      variant={isHomePage && !isScrolled ? "light" : "dark"}
      expand="lg"
      className={`${isHomePage && !isScrolled ? "header-transparent" : ""} ${isHomePage ? "header-fixed" : ""}`}
      fixed={isHomePage ? "top" : undefined} // تطبيق fixed فقط في الصفحة الرئيسية
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <h1 className="text-light logo">
            <span className="logo-part-1">Cour</span>
            <span className="logo-part-2">ses</span>
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ alignItems: "center" }} className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={location.pathname === "/" ? "active-link" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/courses"
              className={location.pathname === "/courses" ? "active-link" : ""}
            >
              Courses
            </Nav.Link>
            {!user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={location.pathname === "/login" ? "active-link" : ""}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={
                    location.pathname === "/register" ? "active-link" : ""
                  }
                >
                  Register
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                as={Link}
                to="/profile"
                className={location.pathname === "/profile" ? "active-link" : ""}
                style={{
                  textDecoration: "none",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    padding: "10px",
                    backgroundColor: "#ebca26",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    fontSize: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="text-light"
                >
                  {user.firstName[0]}
                </span>
                <span>{user.firstName + " " + user.lastName}</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;