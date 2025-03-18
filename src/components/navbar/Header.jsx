import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { toggleCart, clearCart } from "../../features/cart/cartSlice";
import { FaCartPlus } from "react-icons/fa";
import "../../styles/Header.css";
import Logo from "../Logo";
import Cart from "../Cart/Cart"; // Import the Cart component
import ReactGA from "react-ga4"; // استخدام react-ga4 بدل react-ga

// Initialize ReactGA4 (يفضل وضعه في index.js لكن هنا للتجربة)
ReactGA.initialize("G-XXXXXXX"); // استبدل G-XXXXXXX بالـ Measurement ID بتاعك

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart); // Get cart items for badge
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  // تتبع الصفحات باستخدام ReactGA4
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  // تتبع الـ Scroll لتغيير شكل الـ Navbar
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        const heroSectionHeight = heroSection.offsetHeight;
        setIsScrolled(window.scrollY > heroSectionHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
          <Navbar.Brand as={Link} to="/">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            {/* الجزء الأوسط: الروابط */}
            <Nav className="mx-auto">
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
              <Nav.Link
                as={Link}
                to="/community"
                className={location.pathname === "/community" ? "active-link" : ""}
              >
                Community
              </Nav.Link>

              {/* أيقونة السلة على الشاشات الصغيرة */}
              <div
                className="cartIcon position-relative me-3 d-lg-none"
                onClick={() => dispatch(toggleCart())}
              >
                <FaCartPlus />
                {items.length > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {items.length}
                  </span>
                )}
              </div>

              {/* صورة البروفايل على الشاشات الصغيرة */}
              {!user ? (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`skewed-button d-lg-none ${
                    location.pathname === "/login" ? "active-link" : ""
                  }`}
                >
                  Explore Now
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className={`d-lg-none ${
                    location.pathname === "/profile" ? "active-link" : ""
                  }`}
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
                </Nav.Link>
              )}
            </Nav>

            {/* الجزء الأيمن: أيقونة السلة وصورة البروفايل (على الشاشات الكبيرة) */}
            <Nav className="align-items-center d-none d-lg-flex">
              <div
                className="cartIcon position-relative me-3"
                onClick={() => dispatch(toggleCart())}
              >
                <FaCartPlus />
                {items.length > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {items.length}
                  </span>
                )}
              </div>

              {!user ? (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`skewed-button ${
                    location.pathname === "/login" ? "active-link" : ""
                  }`}
                >
                  Explore Now
                </Nav.Link>
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
                </Nav.Link>
              )}
            </Nav>
            
          </Navbar.Collapse>
          
        </Container>
        <div
                className="cartIcon position-relative me-3"
                onClick={() => dispatch(toggleCart())}
              >
                <FaCartPlus />
                {items.length > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {items.length}
                  </span>
                )}
              </div>
      </Navbar>
      <Cart /> {/* Render the Cart component */}
    </>
  );
};

export default Header;