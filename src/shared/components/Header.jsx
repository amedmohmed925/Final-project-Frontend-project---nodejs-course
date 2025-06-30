import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"; // Add NavDropdown
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { toggleCart, clearCart } from "../../features/cart/cartSlice";
import { FaCartPlus } from "react-icons/fa";
import Notifications from "../../features/notifications/components/Notifications";
import "../styles/Header.css";
import Logo from "./Logo";
import Cart from "../../features/cart/components/Cart";
import ReactGA from "react-ga4";
import { getCategories } from "../../features/category/api/categoryApi"; // Import getCategories

ReactGA.initialize("G-XXXXXXX");

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
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
            <Logo isHomePage={isHomePage} isScrolled={isScrolled} />
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            <div
              className="cartIconSmallScreen position-relative me-2 d-lg-none"
              onClick={() => dispatch(toggleCart())}
            >
              <FaCartPlus />
              {items.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {items.length}
                </span>
              )}
            </div>
            {user && (
              <div className="notifications-icon-small-screen me-2 d-lg-none">
                <Notifications />
              </div>
            )}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active-link" : ""}>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/courses"
                className={location.pathname === "/courses" ? "active-link" : ""}
              >
                Courses
              </Nav.Link>
              {/* Add Categories Dropdown */}
              <NavDropdown title="Categories" id="categories-dropdown">
                {categories.map((category) => (
                  <NavDropdown.Item
                    key={category._id}
                    as={Link}
                    to={`/categories/${category._id}`} // Link to category page
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
             
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
              <Nav.Link
                as={Link}
                to="/ContactPage"
                className={location.pathname === "/ContactPage" ? "active-link" : ""}
              >
                Contact
              </Nav.Link>

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
                      overflow: "hidden",
                    }}
                  >
                    <img
                      className="w-100"
                      src={user.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                      alt="user"
                    />
                  </span>
                </Nav.Link>
              )}
            </Nav>

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
              {user && <Notifications />}
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
                      overflow: "hidden",
                    }}
                  >
                    <img
                      className="w-100"
                      src={user.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                      alt="user"
                    />
                  </span>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Cart />
    </>
  );
};

export default Header;