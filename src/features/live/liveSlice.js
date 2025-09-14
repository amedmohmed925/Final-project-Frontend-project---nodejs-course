import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  session: null,
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  participants: [],
  role: 'host',
  loading: false,
  error: null,
};

const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    setSession(s, a) { s.session = a.payload; },
    setIceServers(s, a) { s.iceServers = a.payload?.iceServers || a.payload || s.iceServers; },
    setParticipants(s, a) { s.participants = a.payload; },
    upsertParticipant(s, a) {
      const i = s.participants.findIndex(p => p.userId === a.payload.userId);
      if (i >= 0) s.participants[i] = { ...s.participants[i], ...a.payload };
      else s.participants.push(a.payload);
    },
    removeParticipant(s, a) {
      s.participants = s.participants.filter(p => p.userId !== a.payload.userId);
    },
    setRole(s, a) { s.role = a.payload; },
    setLoading(s, a) { s.loading = a.payload; },
    setError(s, a) { s.error = a.payload; },
    resetLive() { return initialState; },
  },
});

export const {
  setSession, setIceServers, setParticipants,
  upsertParticipant, removeParticipant,
  setRole, setLoading, setError, resetLive,
} = liveSlice.actions;

export default liveSlice.reducer;
