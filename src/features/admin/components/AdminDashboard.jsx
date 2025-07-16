import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../api/dashboardApi";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { FaUsers, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaBook, FaTicketAlt, FaMoneyBillWave, FaExclamationCircle, FaArrowLeft, FaArrowRight, FaChartLine, FaClock, FaClipboardList } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import ChartErrorBoundary from "./ChartErrorBoundary";
import "../styles/AdminDashboard.css";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import SidebarProfile from "../../user/components/SidebarProfile";
import { LogsCount } from "../logss";
import { PaymentsDashboardCard } from "../payment";
import axiosInstance from "../../courses/api/courseApi";

// Register Chart.js elements/scales
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCoursesCount, setPendingCoursesCount] = useState(0);
  const [loadingPendingCourses, setLoadingPendingCourses] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to fetch stats"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchPendingCoursesCount = async () => {
      try {
        const response = await axiosInstance.get("/admin/stats/pending-courses-count");
        setPendingCoursesCount(response.data.pendingCourses);
      } catch (error) {
        console.error("Error fetching pending courses count:", error);
      } finally {
        setLoadingPendingCourses(false);
      }
    };

    fetchPendingCoursesCount();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', color: '#fff' }} />
        <div className="mt-3 text-white">Loading Dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <Container className="py-4">
      <Alert variant="danger" className="text-center">
        <FaExclamationCircle className="me-2" />
        {error}
      </Alert>
    </Container>
  );

  if (!stats) return null;

  // Modern chart colors
  const chartColors = {
    primary: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'],
    secondary: ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
    gradient: ['rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(16, 185, 129, 0.8)']
  };

  // Enhanced pie chart for users
  const userPieData = {
    labels: ["Admins", "Teachers", "Students"],
    datasets: [
      {
        data: [stats.users.admins, stats.users.teachers, stats.users.students],
        backgroundColor: chartColors.primary,
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  // Enhanced bar chart for complaints/coupons
  const barData = {
    labels: ["Open Complaints", "Total Complaints", "Active Coupons", "Total Coupons"],
    datasets: [
      {
        label: "Count",
        data: [stats.complaints.open, stats.complaints.total, stats.coupons.active, stats.coupons.total],
        backgroundColor: chartColors.gradient,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
        displayColors: false
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        style={{
          position: 'fixed',
          top: '50%',
          left: isSidebarOpen ? '280px' : '20px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <Container fluid className="py-4">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 style={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              marginBottom: '10px'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', fontWeight: 500 }}>
              Welcome back! Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>

          {/* Main Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            marginBottom: '40px',
          }}>
            <Card 
              className="stat-card clickable"
              onClick={() => navigate('/admin/users')}
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Users</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.users.total}</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaUsers />
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ 
              border: 'none',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Courses</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.courses}</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaBook />
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ 
              border: 'none',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Revenue</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>${stats.revenue.toLocaleString()}</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaMoneyBillWave />
                  </div>
                </div>
              </Card.Body>
            </Card>

            <div style={{ 
              border: 'none',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              boxShadow: '0 10px 30px rgba(168, 237, 234, 0.3)',
              transition: 'all 0.3s ease',
              height: '100%',
              
            }}>
              <PaymentsDashboardCard />
            </div>
          </div>

          {/* Action Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            marginBottom: '40px',
          }}>
            {/* System Logs Card */}
            <Card 
              className="clickable"
              onClick={() => navigate('/admin/logs')}
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>System Logs</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                      <LogsCount onClick={() => navigate('/admin/logs')} />
                    </div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaClipboardList />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Pending Courses Card */}
            <Card 
              className="clickable"
              onClick={() => navigate('/admin/pending-courses')}
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(255, 167, 38, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pending Courses</div>
                    {loadingPendingCourses ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                        {pendingCoursesCount}
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaClock />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '40px',
          }}>
            <Card style={{ 
              border: 'none',
              borderRadius: '20px',
              background: 'white',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <Card.Body className="p-4">
                <h5 style={{ 
                  fontWeight: 600, 
                  marginBottom: '25px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaChartLine style={{ color: '#667eea' }} />
                  Users Distribution
                </h5>
                <div style={{ height: '300px' }}>
                  <ChartErrorBoundary>
                    <Pie data={userPieData} options={chartOptions} />
                  </ChartErrorBoundary>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ 
              border: 'none',
              borderRadius: '20px',
              background: 'white',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <Card.Body className="p-4">
                <h5 style={{ 
                  fontWeight: 600, 
                  marginBottom: '25px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaExclamationCircle style={{ color: '#ef4444' }} />
                  Complaints Overview
                </h5>
                <div style={{ height: '300px' }}>
                  <ChartErrorBoundary>
                    <Bar data={{
                      labels: ["Open", "Total"],
                      datasets: [
                        {
                          label: "Complaints",
                          data: [stats.complaints.open, stats.complaints.total],
                          backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(107, 114, 128, 0.8)'],
                          borderRadius: 8,
                          borderSkipped: false,
                        },
                      ],
                    }} options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }} />
                  </ChartErrorBoundary>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ 
              border: 'none',
              borderRadius: '20px',
              background: 'white',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <Card.Body className="p-4">
                <h5 style={{ 
                  fontWeight: 600, 
                  marginBottom: '25px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaTicketAlt style={{ color: '#06b6d4' }} />
                  Coupons Status
                </h5>
                <div className="text-center">
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginTop: '30px'
                  }}>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                      borderRadius: '15px',
                      padding: '20px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Active</div>
                      <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.coupons.active}</div>
                    </div>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      borderRadius: '15px',
                      padding: '20px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total</div>
                      <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.coupons.total}</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* User Type Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
          }}>
            {/* Teachers Card */}
            <Card 
              className="clickable"
              onClick={() => navigate('/admin/teachers')}
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Teachers</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                      {stats.users.teachers}
                    </div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaChalkboardTeacher />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Students Card */}
            <Card 
              className="clickable"
              onClick={() => navigate('/admin/students')}
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Students</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                      {stats.users.students}
                    </div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaUserGraduate />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Admins Card */}
            <Card 
              className="clickable"
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/admin/admins')}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Admins</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                      {stats.users.admins}
                    </div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <FaUserShield />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AdminDashboard;