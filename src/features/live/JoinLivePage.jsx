import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSession, setError, setLoading } from "./liveSlice";
import { getIceForSession } from "./api/liveApi";
import PreJoinModal from "./components/PreJoinModal.jsx";
import LiveRoom from "./components/LiveRoom.jsx";
import LiveControls from "./components/LiveControls.jsx";

const JoinLivePage = ({ sessionFromServer }) => {
  const dispatch = useDispatch();
  const [prejoinOpen, setPrejoinOpen] = useState(true);
  const [prejoinChoice, setPrejoinChoice] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sessionFromServer?._id) return;
    dispatch(setSession(sessionFromServer));
    (async () => {
      dispatch(setLoading(true));
      try {
        await getIceForSession(sessionFromServer._id);
      } catch (e) {
        dispatch(setError(e?.message || "Failed to fetch ICE"));
      } finally { dispatch(setLoading(false)); }
    })();
  }, [sessionFromServer, dispatch]);

  const onConfirm = (choice) => { setPrejoinChoice(choice); setPrejoinOpen(false); setReady(true); };

  return (
    <div className="container py-4">
      {ready && (
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold">Live</div>
              <LiveControls />
            </div>
            <LiveRoom prejoinChoice={prejoinChoice} />
          </div>
        </div>
      )}
      <PreJoinModal open={prejoinOpen} onClose={()=>setPrejoinOpen(false)} onConfirm={onConfirm}/>
    </div>
  );
};

export default JoinLivePage;
