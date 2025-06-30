import React, { useEffect, useState } from "react";
import { fetchPayments, deletePayment, clearPayments } from "./paymentAdminApi";
import { fetchUserById } from "./userPaymentApi";
import { Table, Button, Spinner, Alert, Modal, Form, Row, Col } from "react-bootstrap";

import PaymentRow from "./PaymentRow";
const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState(""); // بحث بالاسم
  const [email, setEmail] = useState(""); // بحث بالإيميل
  const [username, setUsername] = useState(""); // بحث باليوزرنيم
  const [userCache, setUserCache] = useState({});
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [orderId, setOrderId] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [limit, setLimit] = useState(50);
  const [modal, setModal] = useState({ show: false, payment: null });
  const [clearModal, setClearModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchAllPayments = async () => {
    setLoading(true);
    setError("");
    try {
      // البحث في المستخدم بالاسم أو الإيميل أو اليوزرنيم
      const data = await fetchPayments({ name, email, username, status, provider, orderId, minAmount, maxAmount, from, to, limit });
      if (data && Array.isArray(data.payments)) {
        setPayments(data.payments);
      } else {
        setPayments([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch payments");
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAllPayments(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAllPayments();
  };

  const handleDelete = async (payment) => {
    setDeleting(true);
    try {
      await deletePayment(payment._id);
      setModal({ show: false, payment: null });
      fetchAllPayments();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
    setDeleting(false);
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await clearPayments();
      setClearModal(false);
      fetchAllPayments();
    } catch (err) {
      setError(err.message || "Clear failed");
    }
    setClearing(false);
  };

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

  return (
    <div className="admin-payments-page container">
      <h2 className="mb-4">Payments Management</h2>
      <Form onSubmit={handleSearch} className="mb-3 p-3 border rounded bg-light">
        <Row className="align-items-center g-2">
          <Col xs={12} md={2}>
            <Form.Control placeholder="Name..." value={name} onChange={e => setName(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={2}>
            <Form.Control placeholder="Email..." value={email} onChange={e => setEmail(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={2}>
            <Form.Control placeholder="Username..." value={username} onChange={e => setUsername(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={2}>
            <Form.Control placeholder="Status..." value={status} onChange={e => setStatus(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={2}>
            <Form.Control placeholder="Provider..." value={provider} onChange={e => setProvider(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={2}>
            <Form.Control placeholder="Order ID..." value={orderId} onChange={e => setOrderId(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={1}>
            <Form.Control type="number" placeholder="Min" value={minAmount} onChange={e => setMinAmount(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={1}>
            <Form.Control type="number" placeholder="Max" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={1}>
            <Form.Control type="date" value={from} onChange={e => setFrom(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={1}>
            <Form.Control type="date" value={to} onChange={e => setTo(e.target.value)} size="sm" />
          </Col>
          <Col xs={12} md={1}>
            <Form.Control type="number" min={1} max={500} value={limit} onChange={e => setLimit(e.target.value)} size="sm" placeholder="Limit" />
          </Col>
          <Col xs={12} md={1}>
            <Button type="submit" size="sm" disabled={loading}>Search</Button>
          </Col>
        </Row>
      </Form>
      <div className="mb-2 d-flex justify-content-end">
        <Button variant="danger" size="sm" onClick={() => setClearModal(true)} disabled={loading || payments.length === 0}>Clear All Payments</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner /> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? payments.map((payment, i) => (
              <PaymentRow key={payment._id} payment={payment} index={i} getUserInfo={getUserInfo} deleting={deleting} setModal={setModal} />
            )) : (
              <tr><td colSpan="8" className="text-center">No payments found.</td></tr>
            )}
          </tbody>
        </Table>
      )}
      {/* Delete Modal */}
      <Modal show={modal.show} onHide={() => setModal({ show: false, payment: null })} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this payment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ show: false, payment: null })}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(modal.payment)} disabled={deleting}>Delete</Button>
        </Modal.Footer>
      </Modal>
      {/* Clear All Modal */}
      <Modal show={clearModal} onHide={() => setClearModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Clear All Payments</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to clear all payments? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setClearModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleClear} disabled={clearing}>Clear All</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentsTable;
