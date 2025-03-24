// src/user/SidebarProfile/SidebarProfile.js
import {
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
  FaBookOpen,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { clearCart } from "../../features/cart/cartSlice"; // استيراد clearCart
import "../../styles/SidebarProfile.css";
import "animate.css";
import { logout } from "../../api/authApi";
import { TbCategoryPlus } from "react-icons/tb";
import { RiAdvertisementFill, RiFunctionAddFill } from "react-icons/ri";
import { MdAdminPanelSettings, MdSchool } from "react-icons/md";
import DeleteAccountModal from "../DeleteAccount/DeleteAccount";
import { useState } from "react";
const SidebarProfile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  console.log(user);

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
        dispatch(clearUser()); // نظف الـ user حتى لو فشل
        dispatch(clearCart()); // نظف الـ cart حتى لو فشل
        navigate("/login");
      });
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
              <FaEdit className="me-2" /> Update Info
            </Link>
          </li>

          {user?.role === "admin" && (
            <>
              <li>
                <Link to="/AdminCouponReport" onClick={onClose}>
                  <MdAdminPanelSettings className="me-2" />
                  Admin Coupon Report
                </Link>
              </li>
              <li>
                <Link to="/all-users" onClick={onClose}>
                  <FaUsers className="me-2" /> All Users
                </Link>
              </li>
              <li>
                <Link to="/CategoryManager" onClick={onClose}>
                  <TbCategoryPlus className="me-2" /> Category Manager
                </Link>
              </li>
            </>
          )}

          {user?.role === "advertiser" && (
            <>
              <li>
                <Link to="/AdvertiserDashboard" onClick={onClose}>
                  <RiAdvertisementFill className="me-2" />
                  Advertiser Dashboard
                </Link>
              </li>
            </>
          )}

          {user?.role === "teacher" && (
            <>
              <li>
                <Link to="/add-course" onClick={onClose}>
                  <RiFunctionAddFill className="me-2" /> Add Course
                </Link>
              </li>
              <li>
                <Link to="/CoursesTeacher" onClick={onClose}>
                  <MdSchool className="me-2" /> My Courses
                </Link>
              </li>
            </>
          )}

         
          <DeleteAccountModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
          />
          <li>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </li>
          <li className="d-flex justify-content-center">
            <button
              className="btn   text-danger"
              onClick={() => setShowDeleteModal(true)}
              style={{ backgroundColor: "red !important" }}
            >
              <FaTrash /> Delete My Account
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarProfile;
