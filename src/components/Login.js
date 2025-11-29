import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login({ onLogin }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setErr(null);
    const res = await login(email, password);
    if(res?.response_code === 1 && res.response_obj?.user){
      onLogin(res.response_obj.user);
      navigate('/');
    } else {
      setErr(res?.response_message || 'Login failed');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                value={password}
                onChange={e=>setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <div className="form-row">
            <button type="submit">Login</button>
          </div>
          {err && <div className="small">{err}</div>}
        </form>
      </div>
    </div>
  )
}
