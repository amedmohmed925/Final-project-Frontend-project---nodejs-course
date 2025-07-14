// src/pages/AdminCouponReport.js
import { useEffect, useState } from "react";
import { getAdminCouponReport } from "../api/couponApi";
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import "../styles/AdminCouponReport.css"; // ملف CSS للتنسيق

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

    const filtered = report
      .map((advertiser) => {
        const filteredCoupons = advertiser.coupons.filter((coupon) =>
          coupon.code.toLowerCase().includes(query)
        );
        const matchesName = advertiser.advertiser.username
          .toLowerCase()
          .includes(query);
        if (matchesName || filteredCoupons.length > 0) {
          return {
            ...advertiser,
            coupons:
              filteredCoupons.length > 0
                ? filteredCoupons
                : advertiser.coupons,
          };
        }
        return null;
      })
      .filter(Boolean);

    setFilteredReport(filtered);
  };

  return (
    <div
      className="admin-page-"
      style={{
        background:
          "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${
          isSidebarOpen ? "sidebar-open" : ""
        }`}
        style={{
          position: "fixed",
          top: "50%",
          left: isSidebarOpen ? "280px" : "20px",
          transform: "translateY(-50%)",
          zIndex: 1000,
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          color: "white",
          fontSize: "18px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease",
          padding: "40px 20px",
        }}
      >
        <div
          className="report-content"
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            className="report-title"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Admin Coupon Report
          </h1>
          <p
            className="total-purchases"
            style={{
              color: "#6b7280",
              fontSize: "1.1rem",
              textAlign: "center",
            }}
          >
            Total Affiliate Purchases:{" "}
            <span>{totalAffiliatePurchases}</span>
          </p>

          <div
            className="search-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <FaSearch className="search-icon" style={{ color: "#6b7280" }} />
            <input
              type="text"
              placeholder="Search by advertiser name or coupon code..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
              style={{
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid #e5e7eb",
                flex: 1,
              }}
            />
          </div>

          <table
            className="report-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              background: "white",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                <th style={{ padding: "15px" }}>Advertiser userName</th>
                <th style={{ padding: "15px" }}>Coupon Code</th>
                <th style={{ padding: "15px" }}>Usage Count</th>
                <th style={{ padding: "15px" }}>Total Purchases</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="no-data"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                      fontStyle: "italic",
                    }}
                  >
                    No results found
                  </td>
                </tr>
              ) : (
                filteredReport.map((advertiser) =>
                  advertiser.coupons.map((coupon, index) => (
                    <tr
                      key={`${advertiser.advertiser.id}-${coupon.code}`}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: "left",
                        fontSize: "0.9rem",
                      }}
                    >
                      {index === 0 ? (
                        <td
                          rowSpan={advertiser.coupons.length}
                          className="advertiser-name"
                          style={{ padding: "15px", fontWeight: "600" }}
                        >
                          {advertiser.advertiser.username}
                        </td>
                      ) : null}
                      <td style={{ padding: "15px" }}>{coupon.code}</td>
                      <td style={{ padding: "15px" }}>{coupon.usageCount}</td>
                      {index === 0 ? (
                        <td
                          rowSpan={advertiser.coupons.length}
                          className="total-purchases"
                          style={{ padding: "15px", fontWeight: "600" }}
                        >
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
    </div>
  );
};

export default AdminCouponReport;