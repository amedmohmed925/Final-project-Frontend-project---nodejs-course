// src/pages/AdminCouponReport.js
import { useEffect, useState } from "react";
import { getAdminCouponReport } from "../../api/coupon";
import SidebarProfile from "../../user/SidebarProfile/SidebarProfile";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import "../../styles/AdminCouponReport.css"; // ملف CSS للتنسيق

const AdminCouponReport = () => {
  const [report, setReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [totalAffiliatePurchases, setTotalAffiliatePurchases] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await getAdminCouponReport();
        setReport(data.report);
        setFilteredReport(data.report); // التقرير المبدئي بدون فلترة
        setTotalAffiliatePurchases(data.totalAffiliatePurchases);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      }
    };
    fetchReport();
  }, []);

  // دالة البحث
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = report.map((advertiser) => {
      const filteredCoupons = advertiser.coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(query)
      );
      const matchesName = advertiser.advertiser.username.toLowerCase().includes(query);
      if (matchesName || filteredCoupons.length > 0) {
        return {
          ...advertiser,
          coupons: filteredCoupons.length > 0 ? filteredCoupons : advertiser.coupons,
        };
      }
      return null;
    }).filter(Boolean);

    setFilteredReport(filtered);
  };

  return (
    <div className="admin-coupon-report-container">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="report-content">
        <h1 className="report-title">Admin Coupon Report</h1>
        <p className="total-purchases">
          Total Affiliate Purchases: <span>{totalAffiliatePurchases}</span>
        </p>

        {/* حقل البحث */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by advertiser name or coupon code..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {/* الجدول */}
        <table className="report-table">
          <thead>
            <tr>
              <th>Advertiser userName</th>
              <th>Coupon Code</th>
              <th>Usage Count</th>
              <th>Total Purchases</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No results found
                </td>
              </tr>
            ) : (
              filteredReport.map((advertiser) =>
                advertiser.coupons.map((coupon, index) => (
                  <tr key={`${advertiser.advertiser.id}-${coupon.code}`}>
                    {index === 0 ? (
                      <td rowSpan={advertiser.coupons.length} className="advertiser-name">
                        {advertiser.advertiser.username}
                      </td>
                    ) : null}
                    <td>{coupon.code}</td>
                    <td>{coupon.usageCount}</td>
                    {index === 0 ? (
                      <td rowSpan={advertiser.coupons.length} className="total-purchases">
                        {advertiser.totalPurchases}
                      </td>
                    ) : null}
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponReport;