import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editUserInfo } from "../userSlice";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaArrowLeft, FaArrowRight, FaGraduationCap, FaUniversity, FaBook, FaUser, FaEnvelope, FaCalendarAlt, FaLock, FaBell, FaEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import SidebarProfile from "../../user/components/SidebarProfile";
import "../styles/UpdateInfo.css";
import { motion } from "framer-motion";
import Logo from '../../../shared/components/Logo';
import { Edit, Edit2, Edit3 } from "lucide-react";

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
    // Teacher-specific fields
    certificates: user.certificates || [],
    graduationYear: user.graduationYear || "",
    university: user.university || "",
    major: user.major || "",
    bio: user.bio || "",
    socialMedia: {
      facebook: user.socialMedia?.facebook || "",
      twitter: user.socialMedia?.twitter || "",
      linkedin: user.socialMedia?.linkedin || "",
      instagram: user.socialMedia?.instagram || "",
    },
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialMedia.")) {
      const socialKey = name.split(".")[1];
      setFormData({
        ...formData,
        socialMedia: { ...formData.socialMedia, [socialKey]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCertificatesChange = (e) => {
    setFormData({ ...formData, certificates: e.target.value.split(",").map(item => item.trim()) });
  };

  const validateForm = () => {
    const { firstName, lastName, email, dob, password, newPassword } = formData;

    // Common fields validation
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

    // Teacher-specific validation
    if (user.role === "teacher") {
      const { certificates, graduationYear, university, major } = formData;
      if (!certificates.length || !graduationYear || !university || !major) {
        setModalMessage("Please fill in all teacher-specific required fields.");
        setIsSuccess(false);
        setShowModal(true);
        return false;
      }
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
    <div
      className="update-info-page"
      style={{
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        style={{
          position: "fixed",
          top: "50%",
          left: isSidebarOpen ? "280px" : "20px",
          transform: "translateY(-50%)",
          zIndex: 1000,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          color: "white",
          fontSize: "18px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      {/* Sidebar */}
      <SidebarProfile
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease",
          padding: "40px 20px",
        }}
      >
            <div className="text-center mb-4">
                            <div style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontSize: '2.5rem',
                              fontWeight: 800,
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px'
                            }}>
                              <FaEdit />
                             Update Your Information
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                               Keep your profile up-to-date for a better experience.
                            </p>
                          </div>
        <div
          className="update-info-container"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            width: "100%",
          }}
        >
        
       

          <form onSubmit={handleSubmit} className="update-form">
            <div className="info-section" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                <label htmlFor="firstName" style={{ fontWeight: "600", marginBottom: "5px" }}>
                  <FaUser style={{ marginRight: "5px" }} /> First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                <label htmlFor="lastName" style={{ fontWeight: "600", marginBottom: "5px" }}>
                  <FaUser style={{ marginRight: "5px" }} /> Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                <label htmlFor="email" style={{ fontWeight: "600", marginBottom: "5px" }}>
                  <FaEnvelope style={{ marginRight: "5px" }} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                <label htmlFor="dob" style={{ fontWeight: "600", marginBottom: "5px" }}>
                  <FaCalendarAlt style={{ marginRight: "5px" }} /> Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                <label htmlFor="password" style={{ fontWeight: "600", marginBottom: "5px" }}>
                  <FaLock style={{ marginRight: "5px" }} /> Current Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                <label htmlFor="newPassword" style={{ fontWeight: "600", marginBottom: "5px" }}>
                  <FaLock style={{ marginRight: "5px" }} /> New Password (Optional)
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            {/* Teacher-Specific Fields */}
            {user.role === "teacher" && (
              <div className="info-section" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                  <label htmlFor="certificates" style={{ fontWeight: "600", marginBottom: "5px" }}>
                    <FaGraduationCap style={{ marginRight: "5px" }} /> Certificates (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="certificates"
                    name="certificates"
                    value={formData.certificates.join(", ")}
                    onChange={handleCertificatesChange}
                    required
                    placeholder="e.g. Certificate1, Certificate2"
                    style={{
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      width: "100%",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                  <label htmlFor="graduationYear" style={{ fontWeight: "600", marginBottom: "5px" }}>
                    <FaCalendarAlt style={{ marginRight: "5px" }} /> Graduation Year
                  </label>
                  <input
                    type="number"
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 2020"
                    style={{
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      width: "100%",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                  <label htmlFor="university" style={{ fontWeight: "600", marginBottom: "5px" }}>
                    <FaUniversity style={{ marginRight: "5px" }} /> University
                  </label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required
                    placeholder="Enter your university"
                    style={{
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      width: "100%",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div className="form-group" style={{ flex: "1 1 calc(50% - 20px)" }}>
                  <label htmlFor="major" style={{ fontWeight: "600", marginBottom: "5px" }}>
                    <FaBook style={{ marginRight: "5px" }} /> Major
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    placeholder="Enter your major"
                    style={{
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      width: "100%",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bio Field - New Addition */}
            <div className="form-group" style={{ flex: "1 1 calc(100% - 20px)" }}>
              <label htmlFor="bio" style={{ fontWeight: "600", marginBottom: "5px" }}>
                <FaUser style={{ marginRight: "5px" }} /> Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter a short bio about yourself"
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  width: "100%",
                  fontSize: "1rem",
                  minHeight: "100px",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={isUpdating}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "white",
                width: "100%",
                marginTop: "20px",
                transition: "all 0.3s ease",
                cursor: isUpdating ? "not-allowed" : "pointer",
              }}
            >
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