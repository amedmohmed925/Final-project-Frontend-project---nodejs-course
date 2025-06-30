import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { fetchPayments } from "./paymentAdminApi";
import { useNavigate } from "react-router-dom";

const PaymentsDashboardCard = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCount = async () => {
      setLoading(true);
      try {
        const data = await fetchPayments({ limit: 1 });
        setCount(data.totalCount || 0);
      } catch {
        setCount(0);
      }
      setLoading(false);
    };
    getCount();
  }, []);

  return (
    <Card
      className="dashboard-card dashboard-card-payments"
      style={{ cursor: "pointer", minWidth: 220, minHeight: 120 }}
      onClick={() => navigate("/admin/payments")}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ fontSize: 18, fontWeight: 600 }}>Payments</div>
        {loading ? <Spinner size="sm" /> : <div style={{ fontSize: 32, fontWeight: 700 }}>{count}</div>}
      </Card.Body>
    </Card>
  );
};

export default PaymentsDashboardCard;
