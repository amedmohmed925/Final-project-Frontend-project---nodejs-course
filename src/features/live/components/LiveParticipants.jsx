import React from 'react';
import { useSelector } from 'react-redux';

const LiveParticipants = ({ currentUserId, role, onHostAction }) => {
  const { participants } = useSelector(s => s.live);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="m-0">Participants</h6>
          <span className="badge bg-secondary">{participants?.length || 0}</span>
        </div>

        <div className="list-group" style={{ maxHeight: 420, overflowY: 'auto' }}>
          {participants.map((p) => (
            <div key={p.userId} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{p.name || p.userId}</div>
                <small className="text-muted">{p.role || 'attendee'}</small>
              </div>
              {role === 'host' && p.userId !== currentUserId && (
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary" title="Mute" onClick={() => onHostAction(p.userId, 'mute')}>🔇</button>
                  <button className="btn btn-outline-secondary" title="Stop Video" onClick={() => onHostAction(p.userId, 'stopVideo')}>🎥✖</button>
                  <button className="btn btn-outline-warning" title="Make Co-host" onClick={() => onHostAction(p.userId, 'makeCohost')}>⭐</button>
                  <button className="btn btn-outline-dark" title="Transfer Host" onClick={() => onHostAction(p.userId, 'transferHost')}>👑</button>
                  <button className="btn btn-outline-danger" title="Remove" onClick={() => onHostAction(p.userId, 'kick')}>⛔</button>
                </div>
              )}
            </div>
          ))}
          {(!participants || participants.length === 0) && (
            <div className="text-muted small">No participants yet… share the invite link.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveParticipants;
