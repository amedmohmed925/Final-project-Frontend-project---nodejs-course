// src/components/Profile.js
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { clearCart } from "../../features/cart/cartSlice"; // استيراد clearCart
import { logout } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserShield, FaCheckCircle, FaTimesCircle, FaEdit, FaSpinner, FaSignOutAlt, FaBars, FaEnvelope, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Card, Row, Col, Button } from "react-bootstrap";
import "animate.css";
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import "../../styles/Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        dispatch(clearUser()); // تنظيف الـ user state
        dispatch(clearCart()); // تنظيف الـ cart state
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        dispatch(clearUser()); // نظف الـ user حتى لو فشل
        dispatch(clearCart()); // نظف الـ cart حتى لو فشل
        navigate("/login");
      });
  };

  if (!user) {
    return (
      <div className="container mt-5 d-flex justify-content-center">
        <FaSpinner className="spinner animate__animated animate__spin" />
      </div>
    );
  }

  return (
    <div className="profile-container animate__animated animate__fadeIn">
      {/* زر فتح السايدبار */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* محتوى البروفايل */}
      <div className={`profile-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="profile-header text-center mb-5 animate__animated ">
          <div className="profile-image-placeholder">
            <img className="w-100" src="https://courssat.com/assets/images/home/avatar.png" alt="user" />
          </div>
          <h1 className="profile-title">Profile</h1>
          <p className="profile-description">
            Welcome to your profile page! Manage your personal and account information here.
          </p>
        </div>
        <Card className="profile-card shadow-lg animate__animated">
          <Card.Body>
            <Row className="g-4">
              <Col md={4} className="text-center">
                <div className="info-section">
                  <FaUser className="info-icon" />
                  <h5>User Details</h5>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>First Name:</strong> {user.firstName}</p>
                  <p><strong>Last Name:</strong> {user.lastName}</p>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <div className="info-section">
                  <FaEnvelope className="info-icon" />
                  <h5>Contact Info</h5>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <div className="info-section">
                  <FaUserShield className="info-icon" />
                  <h5>Account Status</h5>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p>
                    <strong>Verification Status:</strong>
                    {user.isVerified ? (
                      <span className="text-success ms-2">
                        <FaCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="text-danger ms-2">
                        <FaTimesCircle /> Not Verified
                      </span>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
            <div className="text-center mt-4">
              <Button className="btn-custom" onClick={() => navigate("/update-info")}>
                <FaEdit className="me-2" /> Update Info
              </Button>
              <Button className="btn-custom ms-3" variant="danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Profile;