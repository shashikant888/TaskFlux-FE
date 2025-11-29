// Minimal toast utility that injects toasts into the DOM.
export function showToast(message, type = 'error', title) {
  try {
    const containerId = 'taskflux_toast_container';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'success' : 'error'}`;

    if (title) {
      const t = document.createElement('div');
      t.className = 'title';
      t.textContent = title;
      toast.appendChild(t);
    }

    const m = document.createElement('div');
    m.className = 'msg';
    m.textContent = message;
    toast.appendChild(m);

    container.appendChild(toast);

    // Auto remove after 4s
    setTimeout(() => {
      try { container.removeChild(toast); } catch (e) {}
    }, 4000);
  } catch (e) {
    // If DOM fails, fallback to alert
    try { alert(message); } catch (e2) {}
  }
}
