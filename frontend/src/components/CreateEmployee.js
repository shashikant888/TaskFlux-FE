import React, { useState } from 'react';
import { signup } from '../api';

export default function CreateEmployee({ managerId }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setMsg(null);
    setErr(null);
    
    const payload = { name, email, password, role: 'employee', managerId };
    const res = await signup(payload);
    if(res?.response_code === 1){
      setMsg('Employee created successfully');
      setName(''); setEmail(''); setPassword('');
      setTimeout(()=>setShowForm(false), 1500);
    } else {
      setErr(res?.response_message || 'Creation failed');
    }
  }

  return (
    <div>
      {!showForm ? (
        <button onClick={()=>setShowForm(true)}>+ Create Employee</button>
      ) : (
        <div className="card">
          <h3>Create Employee</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required/></div>
            <div className="form-row"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} required/></div>
            
            <div className="form-row">
              <label>Password</label>
              <div style={{position:'relative'}}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required
                />
                <button 
                  type="button" 
                  onClick={()=>setShowPassword(!showPassword)}
                  style={{position:'absolute', right:'8px', top:'8px', background:'none', border:'none', cursor:'pointer'}}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <button type="submit">Create</button>
              <button type="button" onClick={()=>setShowForm(false)} style={{marginLeft:'8px'}}>Cancel</button>
            </div>
            {msg && <div style={{color:'green'}} className="small">{msg}</div>}
            {err && <div style={{color:'red'}} className="small">{err}</div>}
          </form>
        </div>
      )}
    </div>
  )
}
