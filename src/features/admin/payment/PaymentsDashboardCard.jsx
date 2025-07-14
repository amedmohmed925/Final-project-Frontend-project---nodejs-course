import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { fetchPayments } from "./paymentAdminApi";
import { useNavigate } from "react-router-dom";
import { FaMoneyCheckAlt } from "react-icons/fa";

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
      className="clickable"
      style={{ 
        cursor: "pointer", 
        border: 'none',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #a1fe4f 0%, #00feae 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
        transition: 'all 0.3s ease',
        minWidth: '280px',
        minHeight: '150px'
      }}
      onClick={() => navigate("/admin/payments")}
    >
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Payments</div>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{count}</div>
            )}
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <FaMoneyCheckAlt />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PaymentsDashboardCard;
