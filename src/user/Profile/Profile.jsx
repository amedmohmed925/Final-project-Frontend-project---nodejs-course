import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, editUserInfo } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaCheckCircle, FaTimesCircle, FaEdit, FaSpinner, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { Offcanvas, Button } from 'react-bootstrap'; // استيراد Offcanvas و Button من react-bootstrap
import '../../styles/Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // حالة لعرض السايدبار

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
        <FaSpinner className="spinner" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* زر فتح السايدبار */}
      <Button onClick={() => setShowSidebar(true)} className="sidebar-toggle">
        <FaBars />
      </Button>

      {/* السايدبار */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-light'>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-menu">
            <li>
              <button className="btn btn-link" onClick={() => navigate('/update-info')}>
                <FaEdit className="me-2" />
                Update Info
              </button>
            </li>
            <li>
              <button className="btn btn-link" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      {/* محتوى البروفايل */}
      <div className="profile-content">
        <h2 className="mb-4">Profile</h2>
        <div className="card shadow">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h4 className="mb-3">
                  <FaUser className="me-2" />
                  Personal Information
                </h4>
                <div className="mb-3">
                  <strong>Username:</strong> {user.username}
                </div>
                <div className="mb-3">
                  <strong>First Name:</strong> {user.firstName}
                </div>
                <div className="mb-3">
                  <strong>Last Name:</strong> {user.lastName}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="mb-3">
                  <strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}
                </div>
              </div>
              <div className="col-md-6">
                <h4 className="mb-3">
                  <FaUserShield className="me-2" />
                  Account Information
                </h4>
                <div className="mb-3">
                  <strong>Role:</strong> {user.role}
                </div>
                <div className="mb-3">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;