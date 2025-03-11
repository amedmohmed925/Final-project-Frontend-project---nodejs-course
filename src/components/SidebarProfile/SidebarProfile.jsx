import React, { useEffect } from "react";
import { FaUser, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { getCurrentUser } from "../../api/userApi"; // استيراد getCurrentUser

import "../../styles/SidebarProfile.css";

const SidebarProfile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // المستخدم الحالي

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(getCurrentUser(user._id)); // أو أي دالة أخرى لتحميل المستخدم الحالي
    }
    console.log(user)
  }, [dispatch]);
  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
    onClose();
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
              <FaUser className="me-2" /> Profile
            </Link>
          </li>
          <li>
            <Link to="/update-info" onClick={onClose}>
              <FaUser className="me-2" /> Update Info
            </Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarProfile;