import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
// صف سجل واحد: يعرض بيانات الأدمن والمستخدم المستهدف
import PropTypes from "prop-types";

/**
 * @param {{
 *   log: { _id: string, userId: string, action: string, details: string, createdAt: string },
 *   index: number,
 *   getUserInfo: (id: string) => Promise<any>,
 *   deleting?: boolean,
 *   setModal: Function
 * }} props
 */
const LogRow = React.memo(function LogRow({ log, index, getUserInfo, deleting, setModal }) {
LogRow.propTypes = {
  log: PropTypes.shape({
    _id: PropTypes.string,
    userId: PropTypes.string,
    action: PropTypes.string,
    details: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  deleting: PropTypes.bool,
  setModal: PropTypes.func.isRequired,
};
  const [user, setUser] = useState(null); // من قام بالفعل
  const [targetUser, setTargetUser] = useState(null); // المستخدم المستهدف

  // استخراج id المستخدم المستهدف من details
  function extractTargetId(details) {
    const match = details && details.match(/user ([a-fA-F0-9]{24})/);
    return match ? match[1] : null;
  }

  useEffect(() => {
    let mounted = true;
    getUserInfo(log.userId).then(u => { if (mounted) setUser(u); });
    const targetId = extractTargetId(log.details);
    if (targetId) {
      getUserInfo(targetId).then(u => { if (mounted) setTargetUser(u); });
    } else {
      setTargetUser(null);
    }
    return () => { mounted = false; };
  }, [log.userId, log.details]);

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
          log.userId || '-'
        )}
      </td>
      <td>
        {targetUser ? (
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 600 }}>{targetUser.firstName} {targetUser.lastName}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{targetUser.email}</div>
          </div>
        ) : (
          <span style={{ color: '#aaa' }}>-</span>
        )}
      </td>
      <td>{log.action}</td>
      <td>{log.details}</td>
      <td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}</td>
      <td>
        <Button size="sm" variant="danger" onClick={() => setModal({ show: true, log })} disabled={deleting}>Delete</Button>
      </td>
    </tr>
  );
});

export default LogRow;
