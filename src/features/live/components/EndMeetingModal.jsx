import React from "react";

const EndMeetingModal = ({ open, role, onEndAll, onLeave, onClose }) => {
  if (!open) return null;
  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.55)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ background:"#11161a", color:"#e3eef5", border:"1px solid #20303d" }}>
          <div className="modal-header">
            <h5 className="modal-title">Leave meeting?</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            {role === "host"
              ? <p>Do you want to <strong>end</strong> the meeting for everyone, or just <strong>leave</strong>?</p>
              : <p>You can leave the meeting. The meeting will continue for others.</p>
            }
          </div>
          <div className="modal-footer">
            {role === "host" && (
              <button className="btn btn-danger" onClick={onEndAll}>End meeting for all</button>
            )}
            <button className="btn btn-secondary" onClick={onLeave}>Leave meeting</button>
            <button className="btn btn-outline-light" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndMeetingModal;
