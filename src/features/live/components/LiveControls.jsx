import React, { useState } from "react";
import { useRoomControls } from "./LiveRoom";
import EndMeetingModal from "./EndMeetingModal";
import { useSelector } from "react-redux";

const LiveControls = () => {
  const ctx = useRoomControls();
  if (!ctx) return null;
  const {
    role,
    inviteLink,
    isRecording,
    recordToggle,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    isMicOn,
    toggleMic,
    isCamOn,
    toggleCam,
    leaveLive,
    endForAll,
  } = useRoomControls() || {};
  
  // Get session from Redux store
  const { session } = useSelector((state) => state.live);

  const [endOpen, setEndOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState(null); // null, 'participants', 'chat', 'info'
  const [showSettings, setShowSettings] = useState(false);
  
  const onShareToggle = () => {
    if (role !== 'host' && !isScreenSharing) {
      // Participant trying to share screen
      alert('Only the host can initiate screen sharing');
      return;
    }
    isScreenSharing ? stopScreenShare() : startScreenShare();
  };
  
  const toggleSidebar = (panel) => {
    if (activeSidebar === panel) {
      setActiveSidebar(null); // Close if already open
    } else {
      setActiveSidebar(panel); // Open the selected panel
    }
  };

  return (
    <>
      <div className="zoom-style-controls">
        <div className="invite-section">
          <div className="meeting-info">
            <span className="meeting-id">Meeting ID: {session?.roomCode || "Unknown"}</span>
          </div>
          <div className="input-group input-group-sm copy-link">
            <input
              className="form-control"
              readOnly
              value={inviteLink || ""}
              onFocus={(e) => e.target.select()}
            />
            <button
              className="btn btn-copy"
              onClick={async () => {
                if (inviteLink) {
                  await navigator.clipboard.writeText(inviteLink);
                  alert("Invite link copied!");
                }
              }}
            >
              <span className="copy-icon">📋</span>
            </button>
          </div>
        </div>

        <div className="live-toolbar">
          <button
            className={`control-btn ${isMicOn ? '' : 'disabled'}`}
            onClick={() => toggleMic?.(!isMicOn)}
          >
            <div className="control-icon">{isMicOn ? '🎙️' : '🔇'}</div>
            <div className="control-label">{isMicOn ? 'Mute' : 'Unmute'}</div>
          </button>

          <button
            className={`control-btn ${isCamOn ? '' : 'disabled'}`}
            onClick={() => toggleCam?.(!isCamOn)}
          >
            <div className="control-icon">{isCamOn ? '📹' : '🚫'}</div>
            <div className="control-label">{isCamOn ? 'Stop Video' : 'Start Video'}</div>
          </button>

          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''} ${role !== 'host' && !isScreenSharing ? 'disabled' : ''}`}
            onClick={onShareToggle}
          >
            <div className="control-icon">{isScreenSharing ? '📵' : '📊'}</div>
            <div className="control-label">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</div>
          </button>

          <button
            className={`control-btn ${activeSidebar === 'participants' ? 'active' : ''}`}
            onClick={() => toggleSidebar('participants')}
          >
            <div className="control-icon">👥</div>
            <div className="control-label">Participants</div>
          </button>
          
          <button
            className={`control-btn ${activeSidebar === 'chat' ? 'active' : ''}`}
            onClick={() => toggleSidebar('chat')}
          >
            <div className="control-icon">�</div>
            <div className="control-label">Chat</div>
          </button>
          
          <button
            className={`control-btn ${activeSidebar === 'info' ? 'active' : ''}`}
            onClick={() => toggleSidebar('info')}
          >
            <div className="control-icon">ℹ️</div>
            <div className="control-label">Info</div>
          </button>

          {role === 'host' && (
            <button
              className={`control-btn ${isRecording ? "active" : ""}`}
              onClick={recordToggle}
            >
              <div className="control-icon">{isRecording ? '⏹️' : '⏺️'}</div>
              <div className="control-label">{isRecording ? 'Stop Recording' : 'Record'}</div>
            </button>
          )}

          <button className="control-btn danger" onClick={() => setEndOpen(true)}>
            <div className="control-icon">🚪</div>
            <div className="control-label">{role === 'host' ? 'End' : 'Leave'}</div>
          </button>
        </div>
      </div>

      {activeSidebar && (
        <div className="sidebar-panel">
          <div className="panel-header">
            <h5>{
              activeSidebar === 'participants' ? 'Participants' : 
              activeSidebar === 'chat' ? 'Chat' : 
              'Meeting Info'
            }</h5>
            <button className="close-btn" onClick={() => setActiveSidebar(null)}>×</button>
          </div>
          
          {activeSidebar === 'participants' && (
            <div className="participants-list">
              <div className={`participant ${role === 'host' ? 'host' : ''}`}>
                <div className="participant-name">You {role === 'host' ? '(Host)' : ''}</div>
                <div className="participant-controls">
                  <button className="micro-btn">{isMicOn ? '🎙️' : '🔇'}</button>
                  <button className="video-btn">{isCamOn ? '📹' : '🚫'}</button>
                </div>
              </div>
              {/* This will be populated with real participants from the state */}
            </div>
          )}
          
          {activeSidebar === 'chat' && (
            <div className="chat-panel">
              <div className="chat-messages">
                <div className="no-messages">No messages yet</div>
              </div>
              <div className="chat-input">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="form-control"
                />
                <button className="btn btn-primary btn-sm">Send</button>
              </div>
            </div>
          )}
          
          {activeSidebar === 'info' && (
            <div className="info-panel">
              <div className="meeting-meta p-3">
                <p><strong>Meeting ID:</strong> <code>{session?.roomCode || "Unknown"}</code></p>
                <p><strong>Invite Link:</strong></p>
                <div className="d-flex mb-2">
                  <input 
                    type="text" 
                    readOnly 
                    className="form-control form-control-sm" 
                    value={inviteLink || ""} 
                    onFocus={(e) => e.target.select()}
                  />
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => inviteLink && navigator.clipboard.writeText(inviteLink)}
                  >
                    Copy
                  </button>
                </div>
                <p><strong>Role:</strong> {role === 'host' ? 'Host' : 'Participant'}</p>
                {role === 'host' && (
                  <div className="host-controls mt-3">
                    <h6>Host Controls</h6>
                    <div className="btn-group btn-group-sm w-100">
                      <button className="btn btn-outline-primary">Mute All</button>
                      <button className="btn btn-outline-primary">Lock Meeting</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <EndMeetingModal
        open={endOpen}
        role={role}
        onClose={() => setEndOpen(false)}
        onLeave={() => {
          setEndOpen(false);
          leaveLive?.();
        }}
        onEndAll={() => {
          setEndOpen(false);
          endForAll?.();
        }}
      />
    </>
  );
};

export default LiveControls;
