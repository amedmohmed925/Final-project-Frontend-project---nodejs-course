import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { FaCartPlus, FaSignInAlt } from "react-icons/fa"; // استيراد الأيقونة

import "../../styles/Header.css";
import Logo from "../Logo";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        const heroSectionHeight = heroSection.offsetHeight;
        if (window.scrollY > heroSectionHeight) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      style={{
        padding: "0",
        boxShadow: "0px 0px 9px -2px var(--mainColor)",
      }}
      bg={isHomePage && !isScrolled ? "transparent" : "light"}
      variant={isHomePage && !isScrolled ? "dark" : "light"}
      expand="lg"
      className={`${isHomePage && !isScrolled ? "header-transparent" : ""} ${
        isHomePage ? "header-fixed" : ""
      }`}
      fixed={isHomePage ? "top" : undefined}
    >
      <Container>
        <Logo />
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
            <Nav.Link
              as={Link}
              to="/blog"
              className={location.pathname === "/blog" ? "active-link" : ""}
            >
              Blog
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              className={location.pathname === "/about" ? "active-link" : ""}
            >
              About Us
            </Nav.Link>

           <div className="cartIcon">
  <FaCartPlus />
</div>
            {!user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`skewed-button ${
                    location.pathname === "/login" ? "active-link" : ""
                  }`}
                >
                  Explore Now
                </Nav.Link>

              </>
            ) : (
              <Nav.Link
                as={Link}
                to="/profile"
                className={
                  location.pathname === "/profile" ? "active-link" : ""
                }
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
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    fontSize: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    className="w-100"
                    src="https://courssat.com/assets/images/home/avatar.png"
                    alt="user"
                  />
                </span>
                <Nav.Link
              as={Link}
              to="/profile"
              className={location.pathname === "/profile" ? "active-link" : ""}
            >
              profile
            </Nav.Link>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;