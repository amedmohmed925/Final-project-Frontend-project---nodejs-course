import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, editUserInfo } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaCheckCircle, FaTimesCircle, FaEdit, FaSpinner, FaSignOutAlt, FaBars, FaBirthdayCake, FaEnvelope, FaIdBadge, FaTimes } from 'react-icons/fa';
import { Card, Row, Col, Button } from 'react-bootstrap';
import 'animate.css';
import SidebarProfile from '../../components/SidebarProfile/SidebarProfile';
import '../../styles/Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleUpdateInfo = async (updatedData) => {
    setIsUpdating(true);
    try {
      await dispatch(editUserInfo({ id: user._id, ...updatedData })).unwrap();
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.error('Failed to update user info:', error);
    }
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
        onClick={() => setIsSidebarOpen(true)}
        className="sidebar-toggle animate__animated animate__bounceIn"
      >
        <FaBars />
      </button>

      {/* السايدبار */}
      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* محتوى البروفايل */}
      <div className="profile-content">
        <div className="title-container">
          <h1 className="courses-title mb-4 text-center animate__animated animate__fadeInDown">Profile</h1>
          <p className="page-description animate__animated animate__fadeIn">
            Welcome to your profile page! Here, you can view and manage your personal and account information.
          </p>
        </div>
        <Card className="shadow-lg animate__animated animate__fadeInUp">
          <Card.Header>
            <h4 className="mb-0">
              <FaUser className="me-2 icon-hover" />
              User Information
            </h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <strong><FaIdBadge className="me-2 icon-hover" /> Username:</strong> {user.username}
                </div>
                <div className="mb-3">
                  <strong><FaUser className="me-2 icon-hover" /> First Name:</strong> {user.firstName}
                </div>
                <div className="mb-3">
                  <strong><FaUser className="me-2 icon-hover" /> Last Name:</strong> {user.lastName}
                </div>
                <div className="mb-3">
                  <strong><FaEnvelope className="me-2 icon-hover" /> Email:</strong> {user.email}
                </div>
                <div className="mb-3">
                  <strong><FaBirthdayCake className="me-2 icon-hover" /> Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <strong>Role:</strong> {user.role}
                </div>
                <div className="mb-3">
                  <strong>Verification Status:</strong>
                  {user.isVerified ? (
                    <span className="text-success ms-2">
                      <FaCheckCircle className="icon-hover" /> Verified
                    </span>
                  ) : (
                    <span className="text-danger ms-2">
                      <FaTimesCircle className="icon-hover" /> Not Verified
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button className="btn-custom" onClick={() => navigate('/update-info')}>
              <FaEdit className="me-2" />
              Update Info
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Profile;