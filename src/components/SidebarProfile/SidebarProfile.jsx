import { FaEdit, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../features/user/userSlice';

const SidebarProfile = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} className="sidebar-close-btn">
        <FaTimes />
      </button>
      <ul className="sidebar-menu">
        <li>
          <button
            className="btn btn-link text-light"
            onClick={() => navigate('/update-info')}
          >
            <FaEdit className="me-2" />
            Update Info
          </button>
        </li>
        <li>
          <button className="btn btn-link text-light" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarProfile;