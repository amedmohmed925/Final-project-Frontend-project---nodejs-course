import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editUserInfo } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaArrowLeft, FaArrowRight, FaGraduationCap, FaUniversity, FaBook, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import "../../styles/UpdateInfo.css";
import { motion } from "framer-motion";
import Logo from '../../components/Logo';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className="py-4 logoAuth text-center">
            <Logo colorText="#0a3e6e" />
            <motion.h2
              className="fs-4 fw-bold mb-0 mt-3 section-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Update Your Information
            </motion.h2>
          </div>

          <form onSubmit={handleSubmit} className="update-form">
            <div className="info-section">
              {/* Common Fields */}
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

              {/* Teacher-Specific Fields */}
              {user.role === "teacher" && (
                <>
                  <div className="form-group">
                    <label htmlFor="certificates"><FaGraduationCap /> Certificates (comma-separated)</label>
                    <input
                      type="text"
                      id="certificates"
                      name="certificates"
                      value={formData.certificates.join(", ")}
                      onChange={handleCertificatesChange}
                      required
                      placeholder="e.g. Certificate1, Certificate2"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="graduationYear"><FaGraduationCap /> Graduation Year</label>
                    <input
                      type="number"
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 2020"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="university"><FaUniversity /> University</label>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      required
                      placeholder="Enter your university"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="major"><FaBook /> Major</label>
                    <input
                      type="text"
                      id="major"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      required
                      placeholder="Enter your major"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="socialMedia.facebook"><FaFacebook /> Facebook</label>
                    <input
                      type="text"
                      id="socialMedia.facebook"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleChange}
                      placeholder="Facebook URL"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="socialMedia.twitter"><FaTwitter /> Twitter</label>
                    <input
                      type="text"
                      id="socialMedia.twitter"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleChange}
                      placeholder="Twitter URL"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="socialMedia.linkedin"><FaLinkedin /> LinkedIn</label>
                    <input
                      type="text"
                      id="socialMedia.linkedin"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="socialMedia.instagram"><FaInstagram /> Instagram</label>
                    <input
                      type="text"
                      id="socialMedia.instagram"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleChange}
                      placeholder="Instagram URL"
                    />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn" disabled={isUpdating}>
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