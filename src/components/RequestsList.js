import React, { useEffect, useState } from 'react';
import { listTasks, listUsers, patchTask } from '../api';

import RequestItem from './RequestItem';

export default function RequestsList({ user }){
  const [tasks, setTasks] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    load();
    fetchUsers();
    // Listen for cross-component task-created events (avoids full page reload)
    const onCreated = () => load();
    window.addEventListener('taskCreated', onCreated);
    return () => window.removeEventListener('taskCreated', onCreated);
  },[])

  async function fetchUsers(){
    try {
      const res = await listUsers();
      if(res?.response_obj && Array.isArray(res.response_obj)){
        const map = {};
        res.response_obj.forEach(u=>map[u.id]=u);
        setUsersMap(map);
      }
    } catch(e) {
      console.error('Error fetching users:', e);
    }
  }

  async function load(){
    setLoading(true);
    setError(null);
    try {
      const res = await listTasks('?page=1&limit=20');
      if(res?.response_obj){
        let taskList = [];
        // Handle response structure with data key
        if(res.response_obj?.data && Array.isArray(res.response_obj.data)) {
          taskList = res.response_obj.data;
        }
        // Handle direct array
        else if(Array.isArray(res.response_obj)) {
          taskList = res.response_obj;
        }
        // Handle rows structure
        else if(res.response_obj?.rows && Array.isArray(res.response_obj.rows)) {
          taskList = res.response_obj.rows;
        }
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    } catch(e) {
      console.error('Error loading tasks:', e);
      setError('Failed to load requests');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  // For approve/reject, just reload
  async function reloadOnly() {
    await load();
  }

  // For start/close, patch then reload
  async function onAction(id, payload){
    if (id && payload) {
      await patchTask(id, payload);
    }
    await load();
  }

  return (
    <div>
      <h3>Requests</h3>
      {error && <div style={{color:'red'}} className="small">{error}</div>}
      {loading && <div className="small">Loading...</div>}
      {!loading && tasks.length === 0 && <div className="small">No requests found</div>}
      {!loading && Array.isArray(tasks) && tasks.map(t=> (
        <RequestItem key={t.id} task={t} user={user} onAction={onAction} onReload={reloadOnly} />
      ))}
    </div>
  )
}
