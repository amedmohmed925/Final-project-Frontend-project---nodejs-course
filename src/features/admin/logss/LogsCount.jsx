import { useEffect, useState } from "react";
import { fetchLogs } from "./logsAdminApi";
import PropTypes from "prop-types";

const LogsCount = ({ onClick }) => {
  const [count, setCount] = useState(0);
 useEffect(() => {
  fetchLogs({ limit: 1 })
    .then(data => setCount(data.totalCount || 0))
    .catch(() => setCount(0));
}, []);
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', textAlign: 'center' }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{count}</div>
      <div style={{ fontSize: 14, color: '#fff' }}>Logs</div>
    </div>
  );
};

LogsCount.propTypes = {
  onClick: PropTypes.func,
};

export default LogsCount;
