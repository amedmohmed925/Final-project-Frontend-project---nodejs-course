
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
console.log(user) 
 const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser()); 
    navigate('/login'); 
  };

  if (!user) {
    return <div className="container mt-5">Loading...</div>; 
  }

  return (
    <div className="container mt-5">
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
          <div className="mt-4">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;