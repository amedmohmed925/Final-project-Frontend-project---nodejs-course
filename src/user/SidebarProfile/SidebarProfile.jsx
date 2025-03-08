import React from "react";
import { FaUser, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import "../../styles/SidebarProfile";

const SidebarProfile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className={`sidebar-profile ${isOpen ? "open" : ""}`}>
      <button className="close-sidebar" onClick={onClose}>
        <FaTimes />
      </button>
      <div className="sidebar-content">
        <h3 className="sidebar-title">Profile Menu</h3>
        <ul className="sidebar-links">
          <li>
            <Link to="/profile" onClick={onClose}>
              <FaUser className="me-2" />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/update-info" onClick={onClose}>
              <FaUser className="me-2" />
              Update Info
            </Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarProfile;