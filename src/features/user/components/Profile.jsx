import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../user/userSlice";
import { clearCart } from "../../cart/cartSlice";
import { logout } from "../../auth/api/authApi";
import { updateProfileImage } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserShield, FaCheckCircle, FaTimesCircle, FaEdit, FaSpinner, FaSignOutAlt, FaBars, FaEnvelope, FaArrowLeft, FaArrowRight, FaCamera } from "react-icons/fa";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import "animate.css";
import SidebarProfile from "../../user/components/SidebarProfile";
import "../styles/Profile.css"; // Ensure you have the correct path to your CSS file

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        dispatch(clearUser());
        dispatch(clearCart());
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        dispatch(clearUser());
        dispatch(clearCart());
        navigate("/login");
      });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = () => {
    if (!user || !user._id) {
      setErrorMessage("User ID is not available. Please log in again.");
      setShowErrorModal(true);
      return;
    }
    if (!selectedImage) {
      setErrorMessage("Please select an image first.");
      setShowErrorModal(true);
      return;
    }

    dispatch(updateProfileImage({ id: user._id, imageFile: selectedImage }))
      .unwrap()
      .then(() => {
        setSelectedImage(null);
        setImagePreview(null);
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error("Image upload failed:", error);
        setErrorMessage(error.message || "An unknown error occurred");
        setShowErrorModal(true);
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
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`profile-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="profile-header text-center mb-5 animate__animated">
          <div className="profile-image-placeholder position-relative">
            <img
              className="w-100"
              src={imagePreview || user.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
              alt="user"
            />
            <label htmlFor="profileImage" className="camera-icon">
              <FaCamera />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          {selectedImage && (
            <Button
              className="mt-2"
              onClick={handleImageUpload}
              disabled={loading}
            >
              {loading ? <FaSpinner className="spinner" /> : "Upload Image"}
            </Button>
          )}
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
                  <p className="d-flex justify-content-center">
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
              <Button className="btn" onClick={() => navigate("/update-info")}>
                <FaEdit className="me-2" /> Update Info
              </Button>
              <Button className="btn ms-3" variant="danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Profile image updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Failed to update profile image: {errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;