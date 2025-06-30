
import {  Button, } from "react-bootstrap";
import React, { useEffect, useState } from "react";


const PaymentRow = React.memo(function PaymentRow({ payment, index, getUserInfo, deleting, setModal }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let mounted = true;
    getUserInfo(payment.user).then(u => { if (mounted) setUser(u); });
    return () => { mounted = false; };
  }, [payment.user, getUserInfo]);
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {user ? (
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{user.email}</div>
          </div>
        ) : (
          payment.user || '-'
        )}
      </td>
      <td>{payment.orderId}</td>
      <td>{payment.amount}</td>
      <td>{payment.status}</td>
      <td>{payment.provider}</td>
      <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '-'}</td>
      <td>
        <Button size="sm" variant="danger" onClick={() => setModal({ show: true, payment })} disabled={deleting}>Delete</Button>
      </td>
    </tr>
  );
});
export default PaymentRow;
