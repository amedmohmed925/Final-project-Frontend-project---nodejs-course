import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api/http';

// Singleton-ish socket
let socket = null;

export const getSocket = () => {
  const accessToken = localStorage.getItem('accessToken') || '';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id || user?._id || localStorage.getItem('userId') || '';

  if (socket?.connected) return socket;

  socket = io(API_BASE_URL, {
    transports: ['websocket'],
    auth: {
      token: accessToken, // server expects JWT here per your guide
      userId,             // join personal room user_{userId}
    },
    autoConnect: true,
    reconnection: true,
  });

  // If server also checks Authorization header in WS upgrade, you can set extraHeaders:
  // extraHeaders: { Authorization: `Bearer ${accessToken}` },

  return socket;
};
