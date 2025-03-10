import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editUserInfo } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import "../../styles/UpdateInfo.css";

const UpdateInfo = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    password: "",
    newPassword: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, dob, password, newPassword } = formData;

    if (!firstName || !lastName || !email || !dob || !password) {
      setModalMessage("Please fill in all required fields.");
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setModalMessage("Please enter a valid email address.");
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }

    if (newPassword && newPassword.length < 6) {
      setModalMessage("New password must be at least 6 characters long.");
      setIsSuccess(false);
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      await dispatch(editUserInfo({ id: user._id, updatedData: formData })).unwrap();
      setModalMessage("User information updated successfully!");
      setIsSuccess(true);
      setShowModal(true);
    } catch (error) {
      setModalMessage(error.message || "Failed to update user info. Please try again.");
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isSuccess) navigate("/profile");
  };

  return (
    <div className="update-info-page">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      {/* Sidebar */}
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className={`update-info-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="update-info-container profile-card">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
            <FaArrowLeft /> <span>Back to Profile</span>
          </button>

          <h2 className="update-title">Update Your Information</h2>
          <form onSubmit={handleSubmit} className="update-form">
            <div className="info-section">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Current Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password (Optional)</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <button type="submit" className="btn-custom" disabled={isUpdating}>
              {isUpdating ? <FaSpinner className="spinner" /> : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isSuccess ? "Success" : "Error"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant={isSuccess ? "success" : "danger"} onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UpdateInfo;