// src/pages/AdvertiserDashboard.js
import { useEffect, useState } from "react";
import { createCoupon, getAdvertiserCoupons } from "../../api/coupon";
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // استيراد Modal من react-bootstrap
import "../../styles/AdvertiserDashboard.css";

const AdvertiserDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // حالة مودال النجاح
  const [showErrorModal, setShowErrorModal] = useState(false); // حالة مودال الخطأ
  const [errorMessage, setErrorMessage] = useState(""); // رسالة الخطأ

  const fetchCoupons = async () => {
    try {
      const { data } = await getAdvertiserCoupons();
      setCoupons(data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to fetch coupons");
      setShowErrorModal(true);
      console.error("Failed to fetch coupons:", error);
    }
  };

  const handleCreateCoupon = async () => {
    try {
      const response = await createCoupon();
      setShowSuccessModal(true); // عرض مودال النجاح
      fetchCoupons(); // تحديث الكوبونات بعد الإنشاء
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to create coupon");
      setShowErrorModal(true);
      console.error("Failed to create coupon:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <div className="advertiser-dashboard-container">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-content">
        <h1 className="dashboard-title">Advertiser Dashboard</h1>

        <button
          onClick={handleCreateCoupon}
          disabled={coupons.length >= 3}
          className="create-coupon-btn"
        >
          Create Coupon
        </button>

        <table className="coupon-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Usage Count</th>
              <th>Expires At</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No coupons created yet
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.usageCount}</td>
                  <td>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مودال النجاح */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--mainColor)" }}>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Coupon created successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال الخطأ */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#dc3545" }}>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdvertiserDashboard;