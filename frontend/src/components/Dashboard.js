import React from 'react';
import CreateRequest from './CreateRequest';
import RequestsList from './RequestsList';
import CreateEmployee from './CreateEmployee';

const SHOW_TASK_CREATE_TO_MANAGERS = process.env.REACT_APP_SHOW_TASK_CREATE_TO_MANAGERS === 'true';

export default function Dashboard({ user }){
  const canCreateTask = user?.role === 'employee' || (user?.role === 'manager' && SHOW_TASK_CREATE_TO_MANAGERS);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      
      {user?.role === 'manager' && (
        <div className="card">
          <CreateEmployee managerId={user.id} />
        </div>
      )}

      {canCreateTask && (
        <div className="card">
          <CreateRequest user={user} />
        </div>
      )}
      
      <div className="card">
        <RequestsList user={user} />
      </div>
    </div>
  )
}
