import React, { useState } from 'react';
import { signup } from '../api';

const VALID_REFERRAL_CODES = (process.env.REACT_APP_MANAGER_REFERRAL_CODES || 'REF001,REF002,REF003').split(',').map(c => c.trim());

export default function CreateEmployee({ managerId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const payload = { name, email, password, role: 'employee', managerId };
    const res = await signup(payload);
    if (res?.response_code === 1) {
      setMsg('Employee created successfully');
      setName(''); setEmail(''); setPassword('');
      setTimeout(() => setShowForm(false), 1500);
    } else {
      setErr(res?.response_message || 'Creation failed');
    }
  }

  return (
    <div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>+ Create Employee</button>
      ) : (
        <div className="card">
          <h3>Create Employee</h3>
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
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: '8px' }}>Cancel</button>
            </div>
            {msg && <div style={{ color: 'green' }} className="small">{msg}</div>}
            {err && <div style={{ color: 'red' }} className="small">{err}</div>}
          </form>

          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Manager Referral Codes (Share with new managers):</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {VALID_REFERRAL_CODES.map(code => (
                <span key={code} style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
