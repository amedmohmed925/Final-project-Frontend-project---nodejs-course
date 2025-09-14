import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setError, setLoading, setSession, resetLive, setRole } from "./liveSlice";
import { createLiveSession, startLiveSession, getIceForSession } from "./api/liveApi";

import "./LiveTheme.css";
import LiveScheduler from "./components/LiveScheduler.jsx";
import PreJoinModal from "./components/PreJoinModal.jsx";
import LiveRoom from "./components/LiveRoom.jsx";
import LiveControls from "./components/LiveControls.jsx";
import LiveParticipants from "./components/LiveParticipants.jsx";

const LiveSessionPage = ({ asRole = "host" }) => {
  const dispatch = useDispatch();
  const { session, error } = useSelector(s => s.live);

  const [mode, setMode] = useState("choice");
  const [prejoinOpen, setPrejoinOpen] = useState(false);
  const [prejoinChoice, setPrejoinChoice] = useState(null);
  const [rightPanel, setRightPanel] = useState("participants");

  const [form, setForm] = useState({
    title: "", description: "", courseId: "", scheduledAt: "", durationMinutes: 60,
  });

  React.useEffect(() => { dispatch(setRole(asRole)); }, [asRole, dispatch]);

  const inviteLink = useMemo(() => {
    if (!session) return "";
    const base = window.location.origin;
    return `${base}/live/${session._id}?room=${encodeURIComponent(session.roomCode || "")}`;
  }, [session]);

  const onGoLiveClick = () => setPrejoinOpen(true);
  const onPrejoinConfirm = async (choice) => {
    setPrejoinOpen(false); setPrejoinChoice(choice);
    dispatch(setLoading(true)); dispatch(setError(null));
    try {
      const now = new Date().toISOString();
      const s = await createLiveSession({
        title: form.title || "Instant Live",
        description: form.description || "",
        courseId: form.courseId || "COURSE_ID_PLACEHOLDER",
        scheduledAt: now,
        durationMinutes: Number(form.durationMinutes) || 60,
      });
      dispatch(setSession(s));
      await startLiveSession(s._id);
      await getIceForSession(s._id);
      setMode("live");
    } catch (e) {
      dispatch(setError(e?.response?.data?.message || "Failed to start live"));
    } finally { dispatch(setLoading(false)); }
  };
  const startScheduledNow = () => setPrejoinOpen(true);

  return (
    <div className="live-frame">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="text-light m-0">Live Session</h4>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-light" onClick={() => dispatch(setError(null))}>
              Dismiss
            </button>
          </div>
        )}

        {mode === "choice" && (
          <div className="row g-3">
            <div className="col-12 col-lg-7">
              <div className="card live-stage p-3">
                <LiveScheduler form={form} setForm={setForm} onStartNow={onGoLiveClick} onCreated={()=>{}} />
                {session && (
                  <div className="alert alert-info mt-3 meeting-meta">
                    <div><strong>Scheduled:</strong> <code>{session._id}</code></div>
                    <div>Room: <code>{session.roomCode}</code></div>
                    <div className="mt-1">Invite: <code className="user-select-all">{inviteLink}</code></div>
                    <div className="mt-2 d-flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={startScheduledNow}>Start Now</button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(resetLive())}>Clear</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="card live-stage p-3">
                <h6 className="text-light">Tips</h6>
                <ul className="small text-light mb-0">
                  <li>Mesh works best for ~8–12 participants.</li>
                  <li>Use a TURN server in production.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {mode === "live" && session && (
      <div className="live-wrapper">
        <div className="live-main-container">
          <div className="zoom-style-room">
            {/* Stage + Toolbar INSIDE provider */}
            <LiveRoom prejoinChoice={prejoinChoice}>
              <LiveControls />
            </LiveRoom>
          </div>
        </div>
      </div>
        )}

        <PreJoinModal open={prejoinOpen} onClose={()=>setPrejoinOpen(false)} onConfirm={onPrejoinConfirm}/>
      </div>
    </div>
  );
};

export default LiveSessionPage;
