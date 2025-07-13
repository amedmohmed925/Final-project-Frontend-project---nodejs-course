
import React, { useEffect, useState } from "react";
// مكون صف لوج منفصل لجلب بيانات اليوزر وعرضها بشكل احترافي

import { fetchLogs, deleteLog, clearLogs, fetchUserById } from "./logsAdminApi";
import { Table, Button, Spinner, Alert, Modal, Form, Row, Col } from "react-bootstrap";
import LogRow from "./LogRow";
// مكون صف لوج منفصل لجلب بيانات اليوزر وعرضها بشكل احترافي


import SidebarProfile from "../../user/components/SidebarProfile";
import {  FaArrowLeft, FaArrowRight } from "react-icons/fa";
const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const [limit, setLimit] = useState(50);
  const [modal, setModal] = useState({ show: false, log: null });
  const [clearModal, setClearModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // جلب بيانات يوزر بالـ id وتخزينها في كاش
  const getUserInfo = async (userId) => {
    if (!userId) return null;
    if (userCache[userId]) return userCache[userId];
    try {
      const user = await fetchUserById(userId);
      setUserCache((prev) => ({ ...prev, [userId]: user }));
      return user;
    } catch {
      return null;
    }
  };

  const fetchAllLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLogs({ search, userId, action, limit });
      // إذا كان الريسبونس فيه logs (object) استخدمها، إذا كان array (قديم) استخدمها مباشرة
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch logs");
    }
    setLoading(false);
  };

  useEffect(() => { fetchAllLogs(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllLogs();
  };

  const handleDelete = async (log) => {
    setDeleting(true);
    try {
      await deleteLog(log._id);
      setModal({ show: false, log: null });
      fetchAllLogs();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
    setDeleting(false);
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await clearLogs();
      setClearModal(false);
      fetchAllLogs();
    } catch (err) {
      setError(err.message || "Clear failed");
    }
    setClearing(false);
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

    <div className="admin-logs-page container">
      <h2 className="mb-4">Logs Management</h2>
      <Form onSubmit={handleSearch} className="mb-3 p-3 border rounded bg-light">
        <Row className="align-items-center g-2">
          <Col xs={12} md={3}>
            <Form.Control
              placeholder="Search details..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="sm"
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Control
              placeholder="User ID..."
              value={userId}
              onChange={e => setUserId(e.target.value)}
              size="sm"
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Control
              placeholder="Action..."
              value={action}
              onChange={e => setAction(e.target.value)}
              size="sm"
            />
          </Col>
          <Col xs={12} md={2}>
            <Form.Control
              type="number"
              min={1}
              max={500}
              value={limit}
              onChange={e => setLimit(e.target.value)}
              size="sm"
              placeholder="Limit"
            />
          </Col>
          <Col xs={12} md={1}>
            <Button type="submit" size="sm" disabled={loading}>Search</Button>
          </Col>
        </Row>
      </Form>
      <div className="mb-2 d-flex justify-content-end">
        <Button variant="danger" size="sm" onClick={() => setClearModal(true)} disabled={loading || logs.length === 0}>Clear All Logs</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner /> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>By Admin</th>
              <th>Target User</th>
              <th>Action</th>
              <th>Details</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? logs.map((log, i) => (
              <LogRow key={log._id} log={log} index={i} getUserInfo={getUserInfo} deleting={deleting} setModal={setModal} />
            )) : (
              <tr><td colSpan="6" className="text-center">No logs found.</td></tr>
            )}
          </tbody>
        </Table>
      )}
      {/* Delete Modal */}
      <Modal show={modal.show} onHide={() => setModal({ show: false, log: null })} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this log?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ show: false, log: null })}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(modal.log)} disabled={deleting}>Delete</Button>
        </Modal.Footer>
      </Modal>
      {/* Clear All Modal */}
      <Modal show={clearModal} onHide={() => setClearModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Clear All Logs</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to clear all logs? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setClearModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleClear} disabled={clearing}>Clear All</Button>
        </Modal.Footer>
      </Modal>
    </div>
</>
  );
};

export default LogsTable;
