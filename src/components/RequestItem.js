import React from 'react';
import { approveTask, rejectTask, patchTask, startTask, closeTask } from '../api';

const STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
};

function getStatusColor(status) {
  const colors = {
    pending_approval: { bg: '#fff3cd', color: '#856404' },
    approved: { bg: '#d4edda', color: '#155724' },
    rejected: { bg: '#f8d7da', color: '#721c24' },
    in_progress: { bg: '#cfe2ff', color: '#084298' },
    closed: { bg: '#d1ecf1', color: '#0c5460' }
  };
  return colors[status] || { bg: '#e9ecef', color: '#383d41' };
}

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export default function RequestItem({ task, user, onAction, onReload }){
  const status = (task.status || 'unknown').toLowerCase().trim();

  const isManager = user?.role === 'manager';
  // Check both task.assignedToId and task.assignedTo?.id for flexibility
  const isAssignee = user?.id === task.assignedToId || user?.id === task.assignedTo?.id;

  console.log('[RequestItem Debug]', {
    taskId: task.id,
    status,
    userId: user?.id,
    assignedToId: task.assignedToId,
    assignedToUserId: task.assignedTo?.id,
    isAssignee,
    isManager: user?.role === 'manager',
    canStart: isAssignee && status === STATUS.APPROVED,
    canApprove: isManager && status === STATUS.PENDING_APPROVAL,
    canClose: isAssignee && status === STATUS.IN_PROGRESS
  });

  const canApprove = isManager && status === STATUS.PENDING_APPROVAL;
  const canStart = isAssignee && status === STATUS.APPROVED;
  const canClose = isAssignee && status === STATUS.IN_PROGRESS;

  // Safely extract string values
  const title = typeof task.title === 'string' ? task.title : String(task.title || '');
  const description = typeof task.description === 'string' ? task.description : String(task.description || '');

  // Extract user info
  const createdByName = task.createdBy ? `${task.createdBy.name} (${task.createdBy.email})` : 'Unknown';
  const assignedToName = task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned';
  const approvedByName = task.approvedBy ? `${task.approvedBy.name} (${task.approvedBy.email})` : '-';
  const rejectedByName = task.rejectedBy ? `${task.rejectedBy.name} (${task.rejectedBy.email})` : '-';

  // Approve/Reject handlers
  async function handleApprove() {
    await approveTask(task.id);
    // Prefer in-place reload via callback (keeps SPA routing intact). Fall back to full reload.
    if (typeof onReload === 'function') {
      onReload();
    } else {
      setTimeout(() => window.location.reload(), 500);
    }
  }
  async function handleReject() {
    await rejectTask(task.id);
    if (typeof onReload === 'function') {
      onReload();
    } else {
      setTimeout(() => window.location.reload(), 500);
    }
  }
  async function handleStart() {
    await startTask(task.id);
    if (typeof onReload === 'function') {
      onReload();
    } else {
      setTimeout(() => window.location.reload(), 500);
    }
  }
  async function handleClose() {
    await closeTask(task.id);
    if (typeof onReload === 'function') {
      onReload();
    } else {
      setTimeout(() => window.location.reload(), 500);
    }
  }

  return (
    <div className="card">
      <div style={{marginBottom:'12px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <strong style={{fontSize:'16px'}}>{title}</strong>
            <div className="small" style={{marginTop:'4px', color:'#666'}}>{description}</div>
          </div>
          <div style={{minWidth:'140px', textAlign:'right', paddingLeft:'12px'}}>
            <span className={`status ${status}`} style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize',
              backgroundColor: getStatusColor(status).bg,
              color: getStatusColor(status).color
            }}>
              {formatStatus(status)}
            </span>
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px', paddingBottom:'12px', borderBottom:'1px solid #ddd'}}>
        <div>
          <div className="small" style={{color:'#666'}}>Created By</div>
          <div className="small" style={{fontWeight:'500'}}>{createdByName}</div>
        </div>
        <div>
          <div className="small" style={{color:'#666'}}>Assigned To</div>
          <div className="small" style={{fontWeight:'500'}}>{assignedToName}</div>
        </div>
        {task.approvedAt && (
          <div>
            <div className="small" style={{color:'#666'}}>Approved By</div>
            <div className="small" style={{fontWeight:'500'}}>{approvedByName}</div>
          </div>
        )}
        {task.rejectedAt && (
          <div>
            <div className="small" style={{color:'#666'}}>Rejected By</div>
            <div className="small" style={{fontWeight:'500'}}>{rejectedByName}</div>
          </div>
        )}
        <div>
          <div className="small" style={{color:'#666'}}>Created At</div>
          <div className="small">{new Date(task.createdAt).toLocaleDateString()}</div>
        </div>
        {task.approvedAt && (
          <div>
            <div className="small" style={{color:'#666'}}>Approved At</div>
            <div className="small">{new Date(task.approvedAt).toLocaleDateString()}</div>
          </div>
        )}
        {task.rejectedAt && (
          <div>
            <div className="small" style={{color:'#666'}}>Rejected At</div>
            <div className="small">{new Date(task.rejectedAt).toLocaleDateString()}</div>
          </div>
        )}
        {task.startedAt && (
          <div>
            <div className="small" style={{color:'#666'}}>Started At</div>
            <div className="small">{new Date(task.startedAt).toLocaleDateString()}</div>
          </div>
        )}
        {task.closedAt && (
          <div>
            <div className="small" style={{color:'#666'}}>Closed At</div>
            <div className="small">{new Date(task.closedAt).toLocaleDateString()}</div>
          </div>
        )}
      </div>

      <div style={{display:'flex', gap:'8px', flexWrap: 'wrap'}}>
        {canApprove && (
          <>
            <button onClick={handleApprove} style={{background: '#28a745', color: 'white'}}>✓ Approve</button>
            <button onClick={handleReject} style={{background: '#dc3545', color: 'white'}}>✗ Reject</button>
          </>
        )}
        {canStart && (
          <button onClick={handleStart} style={{background: '#007bff', color: 'white'}}>▶ Start</button>
        )}
        {canClose && (
          <button onClick={handleClose} style={{background: '#6c757d', color: 'white'}}>✓ Close</button>
        )}
        {!canApprove && !canStart && !canClose && (
          <div className="small" style={{color: '#999', fontStyle: 'italic'}}>No actions available</div>
        )}
      </div>
    </div>
  )
}
