import React, { useEffect, useState } from 'react';
import { listUsers, addTask } from '../api';

export default function CreateRequest({ user }){
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(()=>{
    async function fetchUsers(){
      const res = await listUsers('?role=employee');
      if(res?.response_obj){
        // Filter out the current logged-in user
        const filtered = res.response_obj.filter(u => u.id !== user?.id);
        setUsers(filtered);
      }
    }
    fetchUsers();
  },[user?.id]);

  async function handleSubmit(e){
    e.preventDefault();
    setMsg(null);
    const payload = { title, description, assignedToId };
    const res = await addTask(payload);
    if(res?.response_code === 1){
      setMsg('Request created');
      setTitle(''); setDescription(''); setAssignedToId('');
      // Notify other components to refresh without reloading the page
      try {
        window.dispatchEvent(new Event('taskCreated'));
      } catch(e) {
        // fallback to full reload if dispatch fails
        setTimeout(() => window.location.reload(), 500);
      }
    } else {
      setMsg(res?.response_message || 'Error');
    }
  }

  return (
    <div>
      <h3>Create Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row"><label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} required/></div>
        <div className="form-row"><label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} required/></div>
        <div className="form-row"><label>Assign To</label>
          <select value={assignedToId} onChange={e=>setAssignedToId(e.target.value)} required>
            <option value="">-- select employee --</option>
            {users.map(u=> <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
        </div>
        <div className="form-row"><button type="submit">Create</button></div>
        {msg && <div className="small">{msg}</div>}
      </form>
    </div>
  )
}
