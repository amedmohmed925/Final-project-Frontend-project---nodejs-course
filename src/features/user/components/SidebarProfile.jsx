import { useEffect, useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaHeart,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../user/userSlice";
import { clearCart } from "../../cart/cartSlice";
import { logout } from "../../auth/api/authApi";
import { getAllProgress } from "../../courseProgress/api/courseProgressApi"; // استيراد API لجلب تقدم الدورات
import "../styles/SidebarProfile.css";
import "animate.css";
import { TbCategoryPlus } from "react-icons/tb";
import { RiAdvertisementFill, RiFunctionAddFill } from "react-icons/ri";
import { MdAdminPanelSettings, MdSchool } from "react-icons/md";
import DeleteAccountModal from "../components/DeleteAccount";
import { IoMdNotifications } from "react-icons/io";

const SidebarProfile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [progressList, setProgressList] = useState([]); // حالة لتخزين تقدم الدورات

  // جلب تقدم الدورات عند فتح الـ Sidebar
  useEffect(() => {
    if (isOpen && user) {
      const fetchProgress = async () => {
        try {
          const data = await getAllProgress();
          setProgressList(data);
        } catch (error) {
          console.error("Failed to fetch progress:", error);
        }
      };
      fetchProgress();
    }
  }, [isOpen, user]);

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
        dispatch(clearUser());
        dispatch(clearCart());
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
                <Link to="/admin/dashboard" onClick={onClose}>
                  <FaChartBar className="me-2" /> Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/AdminCouponReport" onClick={onClose}>
                  <MdAdminPanelSettings className="me-2" /> Admin Coupon Report
                </Link>
              </li>
             
              <li>
                <Link to="/CategoryManager" onClick={onClose}>
                  <TbCategoryPlus className="me-2" /> Category Manager
                </Link>
              </li>
              <li>
                <Link to="/AdminNotificationSender" onClick={onClose}>
                  <IoMdNotifications className="me-2" /> Notification Sender
                </Link>
              </li>
            </>
          )}

          {user?.role === "advertiser" && (
            <li>
              <Link to="/AdvertiserDashboard" onClick={onClose}>
                <RiAdvertisementFill className="me-2" /> Advertiser Dashboard
              </Link>
            </li>
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
              <li>
                <Link to="/teacher/students-manager" onClick={onClose}>
                  <FaUsers className="me-2" /> Student Manager
                </Link>
              </li>
              <li>
                <Link to="/teacher/feedbacks" onClick={onClose}>
                  <FaBookOpen className="me-2" /> Course Feedbacks
                </Link>
              </li>
              <li>
                <Link to="/teacher/exams/create" onClick={onClose}>
                  <FaBookOpen className="me-2" /> Create Exam
                </Link>
              </li>
            </>
          )}

          {user?.role === "student" && (
            <>
              <li>
                <Link to="/student/purchased-courses" onClick={onClose}>
                  <MdSchool className="me-2" /> My Purchased Courses
                </Link>
              </li>
              <li>
                <Link to="/student/favorites" onClick={onClose}>
                  <FaHeart className="me-2 text-danger" /> My Favorites
                </Link>
              </li>
              <li className="progress-section">
                <Link
                  to="/student/progress"
                  onClick={onClose}
                  style={{ textDecoration: "none" }}
                >
                  <FaChartBar className="me-2" /> My Learning Progress
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
              className="btn text-danger"
              onClick={() => setShowDeleteModal(true)}
              style={{ backgroundColor: "transparent" }}
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
