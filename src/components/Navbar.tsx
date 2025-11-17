import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export const Navbar = () => {
  // Usa una sola desestructuración de useAuth
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to={isAuthenticated ? '/chat' : '/'}
        >
          <span className="logo">💬</span>
          <span className="brand-text">Chat Real-Time</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated && user ? (
            <div className="navbar-user">
              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <span className="username">{user.username}</span>
              </div>
              <button onClick={logout} className="btn-logout">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn-login">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn-register">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="nav-links">
        {isAuthenticated && <Link to="/rooms">Salas</Link>}
      </div>
    </nav>
  );
};