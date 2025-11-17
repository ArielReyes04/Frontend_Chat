import { io } from 'socket.io-client';
import { BASE_API_URL } from './api';

// Deriva la URL del servidor (quita /api) y permite override por env
const derivedSocketUrl = BASE_API_URL.replace(/\/api\/?$/, '');
let SOCKET_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SOCKET_URL)
  ? import.meta.env.VITE_SOCKET_URL
  : derivedSocketUrl;

// Si la página está en HTTPS y SOCKET_URL es HTTP, fuerza HTTPS
if (typeof window !== 'undefined' && window.location?.protocol === 'https:' && SOCKET_URL.startsWith('http://')) {
  SOCKET_URL = SOCKET_URL.replace('http://', 'https://');
}

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        path: '/socket.io',
        withCredentials: false,
        autoConnect: true
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomCode, pin, nickname) {
    if (this.socket) {
      this.socket.emit('join_room', { roomCode, pin, nickname });
    }
  }

  sendMessage(roomCode, content) {
    if (this.socket) {
      this.socket.emit('send_message', { roomCode, content });
    }
  }

  getMessages(roomCode, limit = 50) {
    if (this.socket) {
      this.socket.emit('get_messages', { roomCode, limit });
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
