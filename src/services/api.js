import axios from 'axios';

// Base por defecto (producción)
const DEFAULT_API_URL = 'https://chatbackend-production-2318.up.railway.app/api';

// Lee env var (Vercel/Vite) o usa DEFAULT_API_URL
let API_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : DEFAULT_API_URL;

// Si la página está en HTTPS y la API está en HTTP, fuerza HTTPS
if (typeof window !== 'undefined' && window.location?.protocol === 'https:' && API_URL.startsWith('http://')) {
  API_URL = API_URL.replace('http://', 'https://');
}

export const BASE_API_URL = API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin endpoints
export const adminAPI = {
  login: async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },
  
  register: async (username, password) => {
    const response = await api.post('/admin/register', { username, password });
    return response.data;
  }
};

// Room endpoints
export const roomAPI = {
  createRoom: async (type, pin, maxFileSizeMB = 10) => {
    const response = await api.post('/rooms', { type, pin, maxFileSizeMB });
    return response.data;
  },
  
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  
  getRoomInfo: async (roomCode) => {
    const response = await api.get(`/rooms/${roomCode}`);
    return response.data;
  },
  
  uploadFile: async (roomCode, file, nickname) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nickname', nickname);

    const response = await api.post(
      `/rooms/${roomCode}/files`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
};

export default api;
