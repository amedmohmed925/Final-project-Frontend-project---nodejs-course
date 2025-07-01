import { useEffect, useState } from "react";
import { getAllStudents, activateUser, deactivateUser, changeUserRole, deleteUserByAdmin, advancedUserSearch } from "../api/userAdminApi";
import { Table, Button, Form, InputGroup, Spinner, Alert, Modal, Row, Col } from "react-bootstrap";
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaUserGraduate, FaChalkboardTeacher, FaArrowLeft, FaArrowRight } from "react-icons/fa";
const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Advanced search states
  const [searching, setSearching] = useState(false);
  const [searchFields, setSearchFields] = useState({
    role: true,
    isVerified: false,
    username: false,
    email: false,
  });
  const [searchValues, setSearchValues] = useState({
    role: "student",
    isVerified: "",
    username: "",
    email: "",
  });
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState({ show: false, user: null, action: "" });

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to fetch students");
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    // Build params only for checked fields
    const params = {};
    if (searchFields.role) params.role = searchValues.role;
    if (searchFields.isVerified && searchValues.isVerified !== "") params.isVerified = searchValues.isVerified;
    if (searchFields.username && searchValues.username.trim() !== "") params.username = searchValues.username.trim();
    if (searchFields.email && searchValues.email.trim() !== "") params.email = searchValues.email.trim();
    try {
      const data = await advancedUserSearch(params);
      setStudents(data);
    } catch (err) {
      setError(err.message || "Search failed");
    }
    setSearching(false);
  };

  const handleFieldCheck = (field) => {
    setSearchFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleValueChange = (field, value) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));
  };

  const [roleModal, setRoleModal] = useState({ show: false, user: null, newRole: "" });

  const handleAction = async (user, action) => {
    setSelected(user._id);
    try {
      if (action === "activate") await activateUser(user._id);
      if (action === "deactivate") await deactivateUser(user._id);
      if (action === "delete") await deleteUserByAdmin(user._id);
      setModal({ show: false, user: null, action: "" });
      fetchStudents();
    } catch (err) {
      setError(err.message || "Action failed");
    }
    setSelected(null);
  };

  const handleRoleChange = (user, newRole) => {
    setRoleModal({ show: true, user, newRole });
  };

  const doChangeUserRole = async (user, newRole) => {
    setSelected(user._id);
    try {
      await changeUserRole(user._id, newRole);
      setRoleModal({ show: false, user: null, newRole: "" });
      fetchStudents();
    } catch (err) {
      setError(err.message || "Role change failed");
    }
    setSelected(null);
  };

  return (
    <>
     <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    <div className="admin-users-page container">
      <h2 className="mb-4">Students Management</h2>
      <Form onSubmit={handleSearch} className="mb-3 p-3 border rounded bg-light">
        <Row className="align-items-center g-2">
          <Col xs={12} md={2}>
            <Form.Check
              type="checkbox"
              label="Role"
              checked={searchFields.role}
              onChange={() => handleFieldCheck("role")}
              disabled
              style={{ fontWeight: 600 }}
            />
            <Form.Select
              value={searchValues.role}
              onChange={e => handleValueChange("role", e.target.value)}
              size="sm"
              disabled
              className="mt-1"
            >
              <option value="student">Student</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={2}>
            <Form.Check
              type="checkbox"
              label="Verified"
              checked={searchFields.isVerified}
              onChange={() => handleFieldCheck("isVerified")}
            />
            <Form.Select
              value={searchValues.isVerified}
              onChange={e => handleValueChange("isVerified", e.target.value)}
              size="sm"
              disabled={!searchFields.isVerified}
              className="mt-1"
            >
              <option value="">Any</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Username"
              checked={searchFields.username}
              onChange={() => handleFieldCheck("username")}
            />
            <Form.Control
              placeholder="Username..."
              value={searchValues.username}
              onChange={e => handleValueChange("username", e.target.value)}
              size="sm"
              disabled={!searchFields.username}
              className="mt-1"
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Check
              type="checkbox"
              label="Email"
              checked={searchFields.email}
              onChange={() => handleFieldCheck("email")}
            />
            <Form.Control
              placeholder="Email..."
              value={searchValues.email}
              onChange={e => handleValueChange("email", e.target.value)}
              size="sm"
              disabled={!searchFields.email}
              className="mt-1"
            />
          </Col>
          <Col xs={12} md={12} className="mt-2">
            <Button type="submit" disabled={searching} className="me-2">Search</Button>
            <Button variant="secondary" onClick={fetchStudents} disabled={loading || searching}>Reset</Button>
          </Col>
        </Row>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner /> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.username}</td>
                <td>{s.firstName} {s.lastName}</td>
                <td>{s.email}</td>
                <td>{s.isVerified ? "Yes" : "No"}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={s.role}
                    onChange={e => handleRoleChange(s, e.target.value)}
                    disabled={selected===s._id}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="advertiser">Advertiser</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </td>
      {/* Modal for admin role confirmation */}
      <Modal show={roleModal.show} onHide={() => setRoleModal({ show: false, user: null, newRole: "" })} centered backdrop={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span style={{ color: '#dc3545', fontSize: 28, marginRight: 10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#dc3545" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982.874 6.857 11.667c.08.136.115.262.115.393 0 .276-.224.5-.5.5H1.528a.5.5 0 0 1-.5-.5c0-.13.035-.257.115-.393L8 2.44zm.002 4.905a.905.905 0 1 1-1.81 0 .905.905 0 0 1 1.81 0zM7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/>
              </svg>
            </span>
            Confirm Role Change
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div style={{ color: '#dc3545', fontSize: 60 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#dc3545" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982.874 6.857 11.667c.08.136.115.262.115.393 0 .276-.224.5-.5.5H1.528a.5.5 0 0 1-.5-.5c0-.13.035-.257.115-.393L8 2.44zm.002 4.905a.905.905 0 1 1-1.81 0 .905.905 0 0 1 1.81 0zM7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/>
            </svg>
          </div>
          <p className="mt-3">Are you sure you want to assign <b>{roleModal.user?.username}</b> as <b>{roleModal.newRole?.charAt(0).toUpperCase() + roleModal.newRole?.slice(1)}</b>?<br/>This will change their platform permissions.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRoleModal({ show: false, user: null, newRole: "" })}>Cancel</Button>
          <Button variant="danger" onClick={() => doChangeUserRole(roleModal.user, roleModal.newRole)} disabled={selected===roleModal.user?._id}>Confirm</Button>
        </Modal.Footer>
      </Modal>
                <td>
                  {s.isVerified ? (
                    <Button size="sm" variant="warning" disabled={selected===s._id} onClick={() => handleAction(s, "deactivate")}>Deactivate</Button>
                  ) : (
                    <Button size="sm" variant="success" disabled={selected===s._id} onClick={() => handleAction(s, "activate")}>Activate</Button>
                  )}
                  <Button size="sm" variant="danger" className="ms-2" disabled={selected===s._id} onClick={() => setModal({ show: true, user: s, action: "delete" })}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={modal.show} onHide={() => setModal({ show: false, user: null, action: "" })}>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete user {modal.user?.username}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ show: false, user: null, action: "" })}>Cancel</Button>
          <Button variant="danger" onClick={() => handleAction(modal.user, "delete")} disabled={selected===modal.user?._id}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default AdminStudents;
