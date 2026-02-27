import { api } from '../services/mockApi.js';

export const History = async () => {
  const container = document.createElement('div');
  container.className = 'animate-fade-in';

  const user = api.getCurrentUser();
  const complaints = await api.getComplaints(user.aadhaar);

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Complaint History</h2>
    <div class="complaints-list" style="display: flex; flex-direction: column; gap: 1rem;">
      ${complaints.length ? complaints.map(c => `
        <div class="glass-panel" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin-bottom: 0.25rem;">${c.fraud_type || 'General Complaint'}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">ID: ${c.id} | Date: ${new Date(c.createdAt).toLocaleDateString()}</p>
          </div>
          <div style="text-align: right;">
            <span style="
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 0.8rem; 
              background: ${c.status === 'Result' ? '#4ade80' : 'rgba(255,255,255,0.1)'};
              color: ${c.status === 'Result' ? '#000' : 'white'};
            ">${c.status}</span>
          </div>
        </div>
      `).join('') : '<p>No history found.</p>'}
    </div>
  `;

  return container;
};
