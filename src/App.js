import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ContactAdmin from './components/ContactAdmin';
import { getMe, logout, getToken } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchMe() {
      const token = getToken();
      if (!token) {
        if (location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/contact-admin') {
          navigate('/login');
        }
        return;
      }
      const res = await getMe();
      if (res?.response_obj) setUser(res.response_obj);
      else {
        setUser(null);
        navigate('/login');
      }
    }
    fetchMe();

    // Listen for global auth logout events from api layer
    function onAuthLogout() {
      setUser(null);
      navigate('/login');
    }
    window.addEventListener('auth:logout', onAuthLogout);
    return () => window.removeEventListener('auth:logout', onAuthLogout);
  }, [navigate, location.pathname])

  async function handleLogout() {
    await logout();
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="app">
      <header>
        <h1>TaskFlux</h1>
        <nav>
          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">Welcome, {user.name} ({user.role})</span>
                {user.manager && (
                  <span className="manager-info">Manager: {user.manager.name}</span>
                )}
              </div>
              <Link to="/">Dashboard</Link>
              <Link to="/contact-admin">Contact Admin</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && <Link to="/login">Login</Link>}
              {location.pathname !== '/signup' && <Link to="/signup">Signup</Link>}
              <Link to="/contact-admin">Contact Admin</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact-admin" element={<ContactAdmin />} />
          <Route path="/" element={<Dashboard user={user} />} />
        </Routes>
      </main>
    </div>
  )
}
