// src/features/live/components/LiveRoom.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../socket/socketClient";
import { getIceForSession, startLiveSession } from "../api/liveApi";
import {
  setIceServers,
  upsertParticipant,
  removeParticipant,
  resetLive,
  setError,
} from "../liveSlice";

const RoomContext = createContext(null);
export const useRoomControls = () => useContext(RoomContext);

const LiveRoom = ({ prejoinChoice, children }) => {
  const dispatch = useDispatch();
  const { session, iceServers, role } = useSelector((s) => s.live);
  const auth = useSelector((s) => s.auth);
  const currentUserId = auth?.user?.id || "";

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const peersRef = useRef(new Map());

  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(!prejoinChoice?.muted);
  const [isCamOn, setIsCamOn] = useState(!prejoinChoice?.camOff);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const inviteLink = useMemo(() => {
    if (!session) return "";
    const base = window.location.origin;
    return `${base}/live/${session._id}?room=${encodeURIComponent(
      session.roomCode || ""
    )}`;
  }, [session]);

  const attachLocalStream = async () => {
    if (mediaStreamRef.current) return mediaStreamRef.current;
    const constraints = {
      audio: prejoinChoice?.mic
        ? { deviceId: { exact: prejoinChoice.mic } }
        : true,
      video:
        prejoinChoice?.cam && !prejoinChoice.camOff
          ? { deviceId: { exact: prejoinChoice.cam } }
          : false,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    mediaStreamRef.current = stream;
    stream.getAudioTracks().forEach((t) => (t.enabled = isMicOn));
    stream.getVideoTracks().forEach((t) => (t.enabled = isCamOn));
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      await localVideoRef.current.play().catch(() => {});
    }
    return stream;
  };

  const getOrCreatePC = async (remoteUserId) => {
    let entry = peersRef.current.get(remoteUserId);
    if (entry?.pc) return entry.pc;
    const pc = new RTCPeerConnection({ iceServers });

    pc.onicecandidate = (e) =>
      e.candidate &&
      socketRef.current?.emit("live:ice", {
        sessionId: session._id,
        candidate: e.candidate,
        to: remoteUserId,
      });
    pc.ontrack = (ev) => {
      let stream = ev.streams[0];
      if (!entry) entry = {};
      entry.stream = stream;
      let v = entry.videoEl;
      if (!v) {
        v = document.createElement("video");
        v.autoplay = true;
        v.playsInline = true;
        v.muted = false;
        v.className = "tile";
        entry.videoEl = v;
        const container = document.getElementById("remoteGrid");
        if (container) {
          const wrap = document.createElement("div");
          wrap.className =
            "col-12 col-sm-6 col-lg-4 d-flex justify-content-center mb-3";
          wrap.dataset.uid = remoteUserId;
          wrap.appendChild(v);
          container.appendChild(wrap);
        }
      }
      v.srcObject = stream;
      peersRef.current.set(remoteUserId, { ...entry, pc });
    };

    const local = await attachLocalStream();
    local.getTracks().forEach((t) => pc.addTrack(t, local));
    peersRef.current.set(remoteUserId, { ...(entry || {}), pc });
    return pc;
  };

  const makeOfferTo = async (remoteUserId) => {
    const pc = await getOrCreatePC(remoteUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit("live:offer", {
      sessionId: session._id,
      sdp: offer,
      to: remoteUserId,
    });
  };

  // ---- Controls (used by toolbar) ----
  const toggleMic = (on) => {
    const s = mediaStreamRef.current;
    if (!s) return;
    s.getAudioTracks().forEach((t) => (t.enabled = on));
    setIsMicOn(on);
  };
  const toggleCam = (on) => {
    const s = mediaStreamRef.current;
    if (!s) return;
    s.getVideoTracks().forEach((t) => (t.enabled = on));
    setIsCamOn(on);
  };
  const startScreenShare = async () => {
    if (isScreenSharing) return;
    try {
      const scr = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = scr;
      setIsScreenSharing(true);
      
      // Display the screen share video in our UI
      setTimeout(() => {
        const screenShareVideo = document.getElementById('screenShareVideo');
        if (screenShareVideo) {
          screenShareVideo.srcObject = scr;
          console.log("Screen share video attached to UI element");
        } else {
          console.warn("Screen share video element not found");
        }
      }, 100);
      
      const videoTrack = scr.getVideoTracks()[0];
      peersRef.current.forEach(({ pc }) => {
        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender && videoTrack) sender.replaceTrack(videoTrack);
      });
      videoTrack.addEventListener("ended", stopScreenShare);
    } catch (e) {
      console.warn("share error", e);
    }
  };
  const stopScreenShare = () => {
    if (!isScreenSharing) return;
    setIsScreenSharing(false);
    
    // Clean up screen share video element
    const screenShareVideo = document.getElementById('screenShareVideo');
    if (screenShareVideo) {
      screenShareVideo.srcObject = null;
    }
    
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    const camTrack = mediaStreamRef.current?.getVideoTracks()[0];
    peersRef.current.forEach(({ pc }) => {
      const sender = pc
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");
      if (sender && camTrack) sender.replaceTrack(camTrack);
    });
  };
  const recordToggle = () => (isRecording ? stopRecording() : startRecording());
  const startRecording = () => {
    const mixed = new MediaStream();
    mediaStreamRef.current?.getTracks().forEach((t) => mixed.addTrack(t));
    peersRef.current.forEach(({ stream }) => {
      stream?.getTracks().forEach((t) => mixed.addTrack(t));
    });
    const mr = new MediaRecorder(mixed, {
      mimeType: "video/webm;codecs=vp9,opus",
    });
    recordedChunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data?.size) recordedChunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(session?.title || "recording").replace(
        /\s+/g,
        "_"
      )}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    mr.start(1000);
    mediaRecorderRef.current = mr;
    setIsRecording(true);
  };
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const leaveLive = () => {
    try {
      socketRef.current?.emit?.("live:leave", { sessionId: session?._id });
    } catch {}
    peersRef.current.forEach(({ pc }) => pc.close());
    peersRef.current.clear();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    stopRecording();
    setIsScreenSharing(false);
    setIsMicOn(false);
    setIsCamOn(false);
    dispatch(resetLive());
  };

  const endForAll = () => {
    // If your server supports it, listen for 'live:end' to disconnect all.
    socketRef.current?.emit("live:end", { sessionId: session?._id });
    leaveLive();
  };

  // ---- init join ----
  useEffect(() => {
    if (!session?._id) return;
    (async () => {
      try {
        const ice = await getIceForSession(session._id);
        dispatch(setIceServers(ice));
        await attachLocalStream();
        if (session?.status !== "live") await startLiveSession(session._id);

        const socket = getSocket();
        socketRef.current = socket;

        socket.on("live:peer-joined", ({ userId, role: r }) => {
          dispatch(upsertParticipant({ userId, role: r || "attendee" }));
          if (role === "host") makeOfferTo(userId).catch(console.error);
        });
        socket.on("live:peer-left", ({ userId }) => {
          dispatch(removeParticipant({ userId }));
          const entry = peersRef.current.get(userId);
          if (entry) {
            entry.pc.close();
            peersRef.current.delete(userId);
          }
        });
        socket.on("live:offer", async ({ from, sdp }) => {
          const pc = await getOrCreatePC(from);
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("live:answer", {
            sessionId: session._id,
            sdp: answer,
            to: from,
          });
        });
        socket.on("live:answer", async ({ from, sdp }) => {
          const entry = peersRef.current.get(from);
          if (entry?.pc)
            await entry.pc.setRemoteDescription(new RTCSessionDescription(sdp));
        });
        socket.on("live:ice", async ({ from, candidate }) => {
          const entry = peersRef.current.get(from);
          if (entry?.pc && candidate) {
            try {
              await entry.pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.warn("ICE add failed", err);
            }
          }
        });

        socket.emit("live:join", { sessionId: session._id });
      } catch (e) {
        dispatch(setError(e?.message || "Failed to initialize live"));
      }
    })();

    return () => leaveLive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?._id]);

  const ctx = {
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
  };

  return(
    <RoomContext.Provider value={ctx}>
      <div className="video-content-area">
        <div className={`stage-canvas ${isScreenSharing ? 'screen-sharing-active' : ''}`}>
          {isScreenSharing && (
            <div className="screen-share-container">
              <div className="screen-share-label">
                <span className="share-icon">📊</span> Screen Sharing
              </div>
              <video id="screenShareVideo" className="screen-share-video" autoPlay playsInline />
            </div>
          )}
          <div className="local-video-container">
            <video ref={localVideoRef} className="local-video" autoPlay muted playsInline />
            {!isMicOn && <div className="mic-status">🔇</div>}
          </div>
        </div>
        <div className="row mt-3" id="remoteGrid" />
        
        {/* 👇 moved children inside the video-content-area */}
        {children}
      </div>
    </RoomContext.Provider>
  );
};

export default LiveRoom;
