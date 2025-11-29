import React, { useState } from 'react';
import { signup } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const VALID_REFERRAL_CODES = (process.env.REACT_APP_MANAGER_REFERRAL_CODES || 'REF001,REF002,REF003').split(',').map(c => c.trim());

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!VALID_REFERRAL_CODES.includes(referralCode)) {
      setErr('Invalid referral code');
      return;
    }

    const payload = { name, email, password, role: 'manager' };
    const res = await signup(payload);
    if (res?.response_code === 1) {
      setMsg('Manager signup success. Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setErr(res?.response_message || 'Signup failed');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Manager Sign Up</h2>

        <div style={{ background: '#eef2ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #667eea' }}>
          <p style={{ margin: '0 0 10px 0' }}><strong>Note:</strong> This form is for <strong>Managers</strong> only.</p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
            <li style={{ marginBottom: '5px' }}>
              To become a <strong>Manager</strong>, you need a referral code from an existing Manager or you can <Link to="/contact-admin" style={{ color: '#667eea', fontWeight: 'bold' }}>contact us</Link>.
            </li>
            <li>
              To join as an <strong>Employee</strong>, a Manager must create your account for you, or you can <Link to="/contact-admin" style={{ color: '#667eea', fontWeight: 'bold' }}>contact us</Link> for assistance.
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="form-row"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} required /></div>

          <div className="form-row">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '8px', top: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label>Referral Code <span style={{ color: 'red' }}>*</span></label>
            <input value={referralCode} onChange={e => setReferralCode(e.target.value)} required />
          </div>

          <div className="form-row"><button type="submit">Sign up</button></div>
          {msg && <div style={{ color: 'green' }} className="small">{msg}</div>}
          {err && <div style={{ color: 'red' }} className="small">{err}</div>}
        </form>
      </div>
    </div>
  )
}
