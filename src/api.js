import { showToast } from './utils/toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export function getToken(){
  return localStorage.getItem('taskflux_token');
}

export function setToken(t){
  if(t) localStorage.setItem('taskflux_token', t);
}

export function clearToken(){
  localStorage.removeItem('taskflux_token');
}

export async function logout(){
  try {
    await doFetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({})
    });
  } catch(e) {
    console.error('Logout API error:', e);
  }
  clearToken();
}

function authHeaders(){
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function doFetch(url, options = {}){
  const res = await fetch(url, options);
  let parsed = null;
  try { parsed = await res.json(); } catch(e) { parsed = null; }

  if(!res.ok){
    const msg = parsed?.response_obj?.error?.message || parsed?.response_message || parsed?.message || `Request failed: ${res.status}`;
    showToast(msg, 'error');
    return parsed || { response_code: 0, response_message: msg };
  }

  // Show success or error messages based on response_code
  if(parsed && typeof parsed.response_code !== 'undefined'){
    const method = (options.method || 'GET').toUpperCase();
    const showSuccess = options.showSuccess !== undefined ? options.showSuccess : (method !== 'GET');
    if(parsed.response_code === 1){
      if(showSuccess){
        const msg = parsed.response_message || 'Success';
        showToast(msg, 'success');
      }
    } else {
      const msg = parsed.response_message || parsed?.response_obj?.error?.message || 'Operation failed';
      showToast(msg, 'error');
    }
  }

  return parsed;
}

export async function login(email, password){
  const parsed = await doFetch(`${API_BASE}/api/auth/login`, {
    method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email, password })
  });
  if(parsed?.response_obj?.token) setToken(parsed.response_obj.token);
  return parsed;
}

export async function signup(payload){
  return doFetch(`${API_BASE}/api/auth/signup`, {
    method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload)
  });
}

export async function getMe(){
  return doFetch(`${API_BASE}/api/users/me`, { headers: { ...authHeaders() } });
}

export async function listUsers(query = ''){
  const url = `${API_BASE}/api/users${query}`;
  return doFetch(url, { headers: { ...authHeaders() } });
}

export async function listTasks(query = ''){
  const url = `${API_BASE}/api/task${query}`;
  return doFetch(url, { headers: { ...authHeaders() } });
}

export async function addTask(payload){
  return doFetch(`${API_BASE}/api/task`, {
    method:'POST', headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(payload)
  });
}

export async function patchTask(id, payload){
  return doFetch(`${API_BASE}/api/task/${id}`, {
    method:'PATCH', headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(payload)
  });
}

export async function approveTask(id) {
  return doFetch(`${API_BASE}/api/task/${id}/approve`, {
    method: 'PATCH', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({})
  });
}

export async function rejectTask(id) {
  return doFetch(`${API_BASE}/api/task/${id}/reject`, {
    method: 'PATCH', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({})
  });
}

export async function startTask(id) {
  return doFetch(`${API_BASE}/api/task/${id}/start`, {
    method: 'PATCH', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({})
  });
}

export async function closeTask(id) {
  return doFetch(`${API_BASE}/api/task/${id}/close`, {
    method: 'PATCH', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({})
  });
}

export default { login, signup, getMe, listUsers, listTasks, addTask, patchTask, approveTask, rejectTask, startTask, closeTask };
