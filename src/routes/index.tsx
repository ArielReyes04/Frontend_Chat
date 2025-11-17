import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ChatRoom } from '../pages/ChatRoom';
import { NotFound } from '../pages/NotFound';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Navbar } from '../components/Navbar';
import { useAuthContext } from '../context/AuthContext';
import { Rooms } from '../pages/Rooms';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* privadas */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        {/* inicio -> rooms */}
        <Route path="/" element={<Navigate to="/rooms" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};