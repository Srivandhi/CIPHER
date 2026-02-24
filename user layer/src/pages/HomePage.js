import { api } from '../services/mockApi.js';

export const HomePage = async () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';

    const user = api.getCurrentUser();
    const complaints = await api.getComplaints(user.aadhaar);

    // Calculate stats
    const total = complaints.length;
    const pending = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    container.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Welcome back, ${user.name.split(' ')[0]}! 👋</h1>
            <p style="color: var(--text-muted);">Here's what's happening with your complaints today.</p>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
            <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <span style="font-size: 0.9rem; color: var(--text-muted);">Total Complaints</span>
                <span style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${total}</span>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <span style="font-size: 0.9rem; color: var(--text-muted);">Pending Action</span>
                <span style="font-size: 2rem; font-weight: 700; color: #f59e0b;">${pending}</span>
            </div>
            <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <span style="font-size: 0.9rem; color: var(--text-muted);">Resolved</span>
                <span style="font-size: 2rem; font-weight: 700; color: #10b981;">${resolved}</span>
            </div>
        </div>

        <!-- Quick Actions -->
        <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-muted);">Quick Actions</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
            <button class="glass-panel btn-action" onclick="document.querySelector('[data-view=upload]').click()" 
                style="padding: 1.5rem; text-align: left; display: flex; align-items: center; gap: 1rem; transition: var(--transition);">
                <span style="font-size: 1.5rem;">📝</span>
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">File New Complaint</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Report a new cyber incident</div>
                </div>
            </button>
            
            <button class="glass-panel btn-action" onclick="document.querySelector('[data-view=view]').click()"
                style="padding: 1.5rem; text-align: left; display: flex; align-items: center; gap: 1rem; transition: var(--transition);">
                <span style="font-size: 1.5rem;">👀</span>
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Check Status</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Track existing complaints</div>
                </div>
            </button>
        </div>

        <!-- Recent Activity (Mock) -->
        <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-muted);">Recent Activity</h3>
        <div class="glass-panel" style="padding: 0;">
            ${complaints.length > 0 ? complaints.slice(0, 3).map(c => `
                <div style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 500;">${c.title || 'Complaint #' + c.id}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">${new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span style="
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 0.8rem; 
                        background: ${c.status === 'Resolved' ? '#dcfce7' : '#fef3c7'}; 
                        color: ${c.status === 'Resolved' ? '#166534' : '#92400e'};
                    ">${c.status}</span>
                </div>
            `).join('') : '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No recent activity</div>'}
            
            ${complaints.length > 3 ? `
                <div style="padding: 1rem; text-align: center;">
                    <a href="#" onclick="document.querySelector('[data-view=history]').click()" style="color: var(--primary-color); font-size: 0.9rem; font-weight: 500;">View All Activity</a>
                </div>
            ` : ''}
        </div>
    `;

    // Add hover effect styles for action buttons
    const style = document.createElement('style');
    style.textContent = `
        .btn-action:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.9);
            border-color: var(--primary-color);
        }
    `;
    container.appendChild(style);

    return container;
};
