import { liveApi } from './http';

// REST Endpoints (your spec)
export const createLiveSession = async (payload) => {
  // payload: { title, description?, courseId, scheduledAt, durationMinutes? }
  const { data } = await liveApi.post('/live-sessions', payload);
  return data;
};

export const startLiveSession = async (id) => {
  const { data } = await liveApi.post(`/live-sessions/${id}/start`);
  return data;
};

export const getIceForSession = async (id) => {
  const { data } = await liveApi.get(`/live-sessions/${id}/ice`);
  // expects { iceServers: [...] }
  return data;
};

export const getMyNotifications = async () => {
  const { data } = await liveApi.get('/notifications/my-notifications');
  return data;
};

export const markNotificationRead = async (notificationId) => {
  const { data } = await liveApi.put(`/notifications/mark-read/${notificationId}`);
  return data;
};
