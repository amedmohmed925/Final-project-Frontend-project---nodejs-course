import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../api/dashboardApi";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { FaUsers, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaBook, FaTicketAlt, FaMoneyBillWave, FaExclamationCircle, FaCheckCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import ChartErrorBoundary from "./ChartErrorBoundary";
import "../styles/AdminDashboard.css";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import SidebarProfile from "../../user/components/SidebarProfile";
import { LogsCount } from "../logss";
import { PaymentsDashboardCard } from "../payment";

// Register Chart.js elements/scales
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to fetch stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}><Spinner /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return null;

  // Pie chart for users
  const userPieData = {
    labels: ["Admins", "Teachers", "Students"],
    datasets: [
      {
        data: [stats.users.admins, stats.users.teachers, stats.users.students],
        backgroundColor: ["#007bff", "#ffc107", "#28a745"],
      },
    ],
  };

  // Bar chart for complaints/coupons
  const barData = {
    labels: ["Complaints (Open)", "Complaints (Total)", "Coupons (Active)", "Coupons (Total)"],
    datasets: [
      {
        label: "Count",
        data: [stats.complaints.open, stats.complaints.total, stats.coupons.active, stats.coupons.total],
        backgroundColor: ["#dc3545", "#6c757d", "#17a2b8", "#ffc107"],
      },
    ],
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Container className="py-4 admin-dashboard">
        <h2 className="mb-4 text-center" style={{ fontWeight: 800, color: '#0d6efd' }}>Admin Dashboard</h2>
        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          <Card className="stat-card shadow-sm clickable" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <FaUsers className="stat-icon text-primary" />
              <h5>Total Users</h5>
              <div className="stat-value">{stats.users.total}</div>
            </Card.Body>
          </Card>
          <Card className="stat-card shadow-sm">
            <Card.Body>
              <FaBook className="stat-icon text-info" />
              <h5>Total Courses</h5>
              <div className="stat-value">{stats.courses}</div>
            </Card.Body>
          </Card>
          <Card className="stat-card shadow-sm">
            <Card.Body>
              <FaMoneyBillWave className="stat-icon text-success" />
              <h5>Total Revenue</h5>
              <div className="stat-value">${stats.revenue.toLocaleString()}</div>
            </Card.Body>
          </Card>
          <PaymentsDashboardCard />
          <Card className="stat-card shadow-sm clickable" onClick={() => navigate('/admin/logs')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <FaExclamationCircle className="stat-icon text-danger" />
              <h5>Logs</h5>
              <div className="stat-value">
                <LogsCount onClick={() => navigate('/admin/logs')} />
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Users Distribution</h5>
              <ChartErrorBoundary>
                <Pie data={userPieData} />
              </ChartErrorBoundary>
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Complaints</h5>
              <ChartErrorBoundary>
                <Bar data={{
                  labels: ["Complaints (Open)", "Complaints (Total)"],
                  datasets: [
                    {
                      label: "Count",
                      data: [stats.complaints.open, stats.complaints.total],
                      backgroundColor: ["#dc3545", "#6c757d"],
                    },
                  ],
                }} />
              </ChartErrorBoundary>
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Coupons</h5>
              <div className="stat-value" style={{ fontSize: 22, fontWeight: 700 }}>
                Active: <span style={{ color: '#17a2b8' }}>{stats.coupons.active}</span><br />
                Total: <span style={{ color: '#ffc107' }}>{stats.coupons.total}</span>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.5rem',
        }}>
          <Card className="stat-card shadow-sm clickable" onClick={() => navigate('/admin/teachers')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <FaChalkboardTeacher className="stat-icon text-warning" />
              <h6>Teachers</h6>
              <div className="stat-value">{stats.users.teachers}</div>
            </Card.Body>
          </Card>
          <Card className="stat-card shadow-sm clickable" onClick={() => navigate('/admin/students')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <FaUserGraduate className="stat-icon text-success" />
              <h6>Students</h6>
              <div className="stat-value">{stats.users.students}</div>
            </Card.Body>
          </Card>
          <Card className="stat-card shadow-sm">
            <Card.Body>
              <FaUserShield className="stat-icon text-primary" />
              <h6>Admins</h6>
              <div className="stat-value">{stats.users.admins}</div>
            </Card.Body>
          </Card>
        </div>
    </Container>
    </>
  );
};

export default AdminDashboard;
