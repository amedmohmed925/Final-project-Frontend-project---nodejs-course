import { useEffect, useState } from "react";
import { fetchLogs } from "./logsAdminApi";

export default function useLogsCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetchLogs({ limit: 1 })
      .then(data => setCount(data.length >= 1 ? data[0].totalCount || data.length : 0))
      .catch(() => setCount(0));
  }, []);
  return count;
}
