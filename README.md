# TaskFlux - Frontend (React)

This is a minimal React frontend for the TaskFlux Request Management app. It's intentionally small and crude to demonstrate the full-stack flows (signup, login, create request, approve, action, close).

# Backend repo: [(can see more details here)](https://github.com/shashikant888/TaskFlux)

Important notes & assumptions
- The backend base URL should be set in `.env` as `REACT_APP_API_URL` (example `.env` copied from `.env.example`).
- The Postman collection in the repo contains the official API references for `login`, `signup`, `users`, and `task` listing/creation. Some endpoints (approve/reject/action/close) are not present in the collection; the UI will attempt PATCH requests to `/task/:id` for status updates. If your backend uses different endpoints you can update `src/api.js` accordingly.

Run locally
1. cd frontend
2. npm install
3. copy `.env.example` to `.env` and set `REACT_APP_API_URL` to your backend (e.g. `http://localhost:3000`)
4. npm start

What the UI provides
- Sign Up
- Sign In
- Create Request (employee A assigns to employee B)
- Requests list (shows status and available actions)
- Approve/Reject buttons for managers (client-side guarded)
- Action/Close buttons for assignees once approved

If you change backend endpoints, update `src/api.js` helpers.
