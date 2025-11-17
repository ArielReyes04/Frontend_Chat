import axios from 'axios';

// Base por defecto (producción)
const DEFAULT_API_URL = 'https://chatbackend-production-2318.up.railway.app/api';

// Lee env var (Vercel/Vite) o usa DEFAULT_API_URL
let API_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : DEFAULT_API_URL;

// Normaliza/fortalece para evitar Mixed Content o puertos dev en producción
if (typeof window !== 'undefined') {
  const isHttpsPage = window.location?.protocol === 'https:';
  try {
    const url = new URL(API_URL);

    // Si la página es HTTPS y la API es HTTP, fuerza HTTPS
    if (isHttpsPage && url.protocol === 'http:') {
      url.protocol = 'https:';
    }

    const isSameHostAsFrontend = url.hostname === window.location.hostname;
    const hasCustomPort = !!url.port && url.port !== '443' && url.port !== '80';

    // Si apunta al mismo host del frontend o usa puerto dev, usa la URL por defecto (Railway)
    if (isSameHostAsFrontend || hasCustomPort) {
      API_URL = DEFAULT_API_URL;
    } else {
      API_URL = url.toString().replace(/\/$/, ''); // sin slash final
    }
  } catch {
    API_URL = DEFAULT_API_URL;
  }
}

export const BASE_API_URL = API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Admin endpoints
export const adminAPI = {
  login: async (username, password) => (await api.post('/admin/login', { username, password })).data,
  register: async (username, password) => (await api.post('/admin/register', { username, password })).data
};

// Room endpoints
export const roomAPI = {
  createRoom: async (type, pin, maxFileSizeMB = 10) => (await api.post('/rooms', { type, pin, maxFileSizeMB })).data,
  getRooms: async () => (await api.get('/rooms')).data,
  getRoomInfo: async (roomCode) => (await api.get(`/rooms/${roomCode}`)).data,
  uploadFile: async (roomCode, file, nickname) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nickname', nickname);
    return (await api.post(`/rooms/${roomCode}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
  }
};

export default api;
