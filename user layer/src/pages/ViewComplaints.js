import { api } from '../services/mockApi.js';

export const ViewComplaints = async () => {
  const container = document.createElement('div');
  container.className = 'animate-fade-in';

  const user = api.getCurrentUser();
  const complaints = await api.getComplaints(user.aadhaar);

  if (complaints.length === 0) {
    container.innerHTML = `<div class="glass-panel" style="padding: 2rem; text-align: center;">No active complaints found.</div>`;
    return container;
  }

  // Show most recent active complaint or list them
  // For this view, let's show the latest one with a detailed flow map
  const latest = complaints[0];

  container.innerHTML = `
    <div class="glass-panel" style="padding: 2rem;">
      <h2 style="margin-bottom: 1rem;">Complaint Status: ${latest.id}</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">${latest.fraud_type || 'General Complaint'}</p>
      
      <div class="flow-map">
        <div class="step active">
          <div class="circle">1</div>
          <div class="label">Submitted</div>
        </div>
        <div class="line"></div>
        <div class="step ${['Verified', 'LEA', 'Result'].includes(latest.status) ? 'active' : ''}">
          <div class="circle">2</div>
          <div class="label">Verified by Officials</div>
        </div>
        <div class="line"></div>
        <div class="step ${['LEA', 'Result'].includes(latest.status) ? 'active' : ''}">
          <div class="circle">3</div>
          <div class="label">Passed to LEA</div>
        </div>
        <div class="line"></div>
        <div class="step ${latest.status === 'Result' ? 'active' : ''}">
          <div class="circle">4</div>
          <div class="label">Result Declared</div>
        </div>
      </div>

      <div style="margin-top: 2rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
        <h4>Current Status Note:</h4>
        <p style="color: var(--text-muted);">${latest.history[latest.history.length - 1].note}</p>
      </div>
    </div>
    
    <style>
      .flow-map {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 2rem 0;
      }
      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.5;
        transition: var(--transition);
      }
      .step.active {
        opacity: 1;
      }
      .circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--glass-bg);
        border: 2px solid var(--glass-border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .step.active .circle {
        background: var(--primary-color);
        border-color: var(--primary-color);
      }
      .line {
        flex: 1;
        height: 2px;
        background: var(--glass-border);
        margin: 0 1rem;
        margin-bottom: 1.5rem; /* Align with circle center roughly */
      }
      .label {
        font-size: 0.8rem;
        text-align: center;
        max-width: 100px;
      }
    </style>
  `;

  return container;
};
