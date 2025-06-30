import { useEffect, useState } from "react";
import { advancedUserSearch, activateUser, deactivateUser, deleteUserByAdmin, changeUserRole } from "../api/userAdminApi";
import { Table, Container, Alert, Spinner, Button, Form, Row, Col, Modal } from "react-bootstrap";
import SidebarProfile from "../../user/components/SidebarProfile";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const UserTable = ({
  title = "All Users",
  defaultRole = "",
  showSidebar = true,
  sidebarProps = {},
  searchFieldsDefault = { role: false, isVerified: false, username: false, email: false },
  searchValuesDefault = { role: "", isVerified: "", username: "", email: "" },
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFields, setSearchFields] = useState(searchFieldsDefault);
  const [searchValues, setSearchValues] = useState({ ...searchValuesDefault, role: defaultRole || searchValuesDefault.role });
  const [modal, setModal] = useState({ show: false, user: null, action: "" });
  const [selected, setSelected] = useState(null);
  const [roleModal, setRoleModal] = useState({ show: false, user: null, newRole: "" });

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (defaultRole) params.role = defaultRole;
      const data = await advancedUserSearch(params);
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [defaultRole]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    const params = {};
    if (searchFields.role && searchValues.role) params.role = searchValues.role;
    if (searchFields.isVerified && searchValues.isVerified !== "") params.isVerified = searchValues.isVerified;
    if (searchFields.username && searchValues.username.trim() !== "") params.username = searchValues.username.trim();
    if (searchFields.email && searchValues.email.trim() !== "") params.email = searchValues.email.trim();
    try {
      const data = await advancedUserSearch(params);
      setUsers(data);
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

  const handleAction = async (user, action) => {
    setSelected(user._id);
    try {
      if (action === "activate") await activateUser(user._id);
      if (action === "deactivate") await deactivateUser(user._id);
      if (action === "delete") await deleteUserByAdmin(user._id);
      setModal({ show: false, user: null, action: "" });
      fetchUsers();
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
      fetchUsers();
    } catch (err) {
      setError(err.message || "Role change failed");
    }
    setSelected(null);
  };

  return (
    <div>
      {showSidebar && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`sidebar-arrow-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
          aria-label="Toggle Sidebar"
        >
        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
      )}
      {showSidebar && <SidebarProfile isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} {...sidebarProps} />}
      <Container className={`all-users-container animate__animated animate__fadeIn ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <h1 className="text-center my-5">{title}</h1>
        <Form onSubmit={handleSearch} className="mb-3 p-3 border rounded bg-light">
          <Row className="align-items-center g-2">
            <Col xs={12} md={2}>
              <Form.Check
                type="checkbox"
                label="Role"
                checked={searchFields.role}
                onChange={() => handleFieldCheck("role")}
              />
              <Form.Select
                value={searchValues.role}
                onChange={e => handleValueChange("role", e.target.value)}
                size="sm"
                disabled={!searchFields.role}
                className="mt-1"
              >
                <option value="">Any</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="advertiser">Advertiser</option>
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
              <Button variant="secondary" onClick={fetchUsers} disabled={loading || searching}>Reset</Button>
            </Col>
          </Row>
        </Form>
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" className="spinner" />
          </div>
        ) : (
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
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.dob ? new Date(user.dob).toLocaleDateString() : "-"}</td>
                    <td>{user.isVerified ? <span className="text-success">Yes</span> : <span className="text-danger">No</span>}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={user.role}
                        onChange={e => handleRoleChange(user, e.target.value)}
                        disabled={selected===user._id}
                      >
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                        <option value="advertiser">Advertiser</option>
                      </Form.Select>
                    </td>
                    <td>
                      {user.isVerified ? (
                        <Button size="sm" variant="warning" disabled={selected===user._id} onClick={() => handleAction(user, "deactivate")}>Deactivate</Button>
                      ) : (
                        <Button size="sm" variant="success" disabled={selected===user._id} onClick={() => handleAction(user, "activate")}>Activate</Button>
                      )}
                      <Button size="sm" variant="danger" className="ms-2" disabled={selected===user._id} onClick={() => setModal({ show: true, user, action: "delete" })}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        {/* Modal for role change confirmation */}
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
        <Modal show={modal.show} onHide={() => setModal({ show: false, user: null, action: "" })}>
          <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
          <Modal.Body>Are you sure you want to delete user {modal.user?.username}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal({ show: false, user: null, action: "" })}>Cancel</Button>
            <Button variant="danger" onClick={() => handleAction(modal.user, "delete")} disabled={selected===modal.user?._id}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default UserTable;
