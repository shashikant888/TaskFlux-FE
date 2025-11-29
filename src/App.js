import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { getMe, logout, getToken } from './api';

export default function App(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    async function fetchMe(){
      const token = getToken();
      if(!token) return;
      const res = await getMe();
      if(res?.response_obj) setUser(res.response_obj);
    }
    fetchMe();
  },[])

  async function handleLogout(){
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
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login onLogin={(u)=>setUser(u)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard user={user} />} />
        </Routes>
      </main>
    </div>
  )
}
