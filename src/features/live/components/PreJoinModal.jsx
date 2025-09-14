import React, { useEffect, useRef, useState } from "react";

const PreJoinModal = ({ open, onClose, onConfirm }) => {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState({ audios: [], videos: [] });
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedCam, setSelectedCam] = useState("");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const previewStreamRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        const audios = all.filter(d => d.kind === "audioinput");
        const videos = all.filter(d => d.kind === "videoinput");
        setDevices({ audios, videos });
        setSelectedMic(audios[0]?.deviceId || "");
        setSelectedCam(videos[0]?.deviceId || "");
      } catch {}
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const startPreview = async () => {
      try {
        if (previewStreamRef.current) {
          previewStreamRef.current.getTracks().forEach(t => t.stop());
        }
        const constraints = {
          audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
          video: selectedCam && !camOff ? { deviceId: { exact: selectedCam } } : false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        previewStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        stream.getAudioTracks().forEach(t => (t.enabled = !muted));
      } catch (e) {
        console.warn("Preview error", e);
      }
    };
    startPreview();
    return () => {
      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach(t => t.stop());
        previewStreamRef.current = null;
      }
    };
  }, [open, selectedMic, selectedCam, muted, camOff]);

  if (!open) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Preview & devices</h5>
            <button type="button" className="btn-close" onClick={onClose}/>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12 col-md-7">
                <div className="ratio ratio-4x3 bg-dark rounded">
                  <video ref={videoRef} muted playsInline style={{ borderRadius: 8 }}/>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className={`btn ${muted ? 'btn-danger':'btn-outline-danger'}`} onClick={()=>setMuted(!muted)}>
                    {muted ? "Unmute" : "Mute"}
                  </button>
                  <button className={`btn ${camOff ? 'btn-secondary':'btn-outline-secondary'}`} onClick={()=>setCamOff(!camOff)}>
                    {camOff ? "Start Video" : "Stop Video"}
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-5">
                <label className="form-label">Microphone</label>
                <select className="form-select" value={selectedMic} onChange={e=>setSelectedMic(e.target.value)}>
                  {devices.audios.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || "Microphone"}</option>)}
                </select>
                <label className="form-label mt-3">Camera</label>
                <select className="form-select" value={selectedCam} onChange={e=>setSelectedCam(e.target.value)}>
                  {devices.videos.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || "Camera"}</option>)}
                </select>
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="alwaysPreview" defaultChecked/>
                  <label className="form-check-label" htmlFor="alwaysPreview">Always show this preview when joining</label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => onConfirm({ mic: selectedMic, cam: selectedCam, muted, camOff })}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreJoinModal;
