export const ComplaintSuccess = () => {
  const container = document.createElement('div');
  container.className = 'glass-panel animate-fade-in';
  container.style.padding = '3rem';
  container.style.maxWidth = '600px';
  container.style.margin = '2rem auto';
  container.style.textAlign = 'center';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';

  const params = new URLSearchParams(window.location.search);
  const complaintId = params.get('id') || 'Unknown';

  container.innerHTML = `
    <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    
    <h2 style="font-size: 2rem; margin-bottom: 1rem;">Complaint Submitted!</h2>
    
    <p class="text-muted" style="margin-bottom: 2rem; font-size: 1.1rem;">
      Your complaint has been successfully registered. We have sent a confirmation to your registered email/phone.
    </p>

    <div style="background: rgba(255,255,255,0.4); padding: 1.5rem; border-radius: 12px; margin-bottom: 2.5rem; width: 100%; border: 1px solid rgba(0,0,0,0.05);">
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Complaint Reference ID</p>
      <p style="font-size: 1.5rem; font-weight: bold; letter-spacing: 1px; color: var(--primary-color);">${complaintId}</p>
    </div>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
      <a href="/dashboard" class="btn-primary" data-link>Go to Dashboard</a>
      <a href="/dashboard?view=view" class="btn-secondary" data-link>View Status</a>
    </div>
  `;

  return container;
};
