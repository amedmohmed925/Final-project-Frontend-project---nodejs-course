import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getCurrentUser } from "../../api/userApi";
import { Table, Container, Alert, Spinner } from "react-bootstrap";
import { FaUserGraduate, FaChalkboardTeacher, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "animate.css";
import "../../styles/AllUsers.css";
import SidebarProfile from "../SidebarProfile/SidebarProfile";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const { users, loading, error } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(getCurrentUser(user._id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      dispatch(getAllUsers());
    }
  }, [dispatch, currentUser]);

  if (currentUser?.role !== "admin") {
    return (
      <Container className="mt-5 text-center animate__animated animate__fadeIn">
        <Alert variant="danger">
          You do not have permission to view this page.
        </Alert>
      </Container>
    );
  }

  const teachers = users?.filter((user) => user.role === "teacher") || [];
  const students = users?.filter((user) => user.role === "student") || [];

  return (
    <div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Container
        className={`all-users-container animate__animated animate__fadeIn ${
          isSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <h1 className="text-center my-5">All Users</h1>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" className="spinner" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <div className="table-section">
          <h2 className="table-title">
            <FaChalkboardTeacher className="me-2" /> Teachers
          </h2>
          <Table striped bordered hover responsive className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher, index) => (
                  <tr key={teacher._id}>
                    <td>{index + 1}</td>
                    <td>{teacher.username}</td>
                    <td>{teacher.firstName}</td>
                    <td>{teacher.lastName}</td>
                    <td>{teacher.email}</td>
                    <td>{new Date(teacher.dob).toLocaleDateString()}</td>
                    <td>
                      {teacher.isVerified ? (
                        <span className="text-success">Yes</span>
                      ) : (
                        <span className="text-danger">No</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="table-section mt-5">
          <h2 className="table-title">
            <FaUserGraduate className="me-2" /> Students
          </h2>
          <Table striped bordered hover responsive className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.username}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                    <td>
                      {student.isVerified ? (
                        <span className="text-success">Yes</span>
                      ) : (
                        <span className="text-danger">No</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default AllUsers;