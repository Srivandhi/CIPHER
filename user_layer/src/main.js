import './style.css';
import { Router } from './router.js';
import { api } from './services/mockApi.js';

// Placeholder components (will be replaced by real files later)
const Home = async () => {
    const div = document.createElement('div');
    div.className = 'page-container animate-fade-in';
    div.innerHTML = `
    <div class="glass-panel" style="padding: 3rem; text-align: center; max-width: 600px;">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Citizen Grievance Portal</h1>
      <p style="margin-bottom: 2rem; color: var(--text-muted);">Secure, Transparent, and Efficient Complaint Resolution</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="/login" class="btn-primary" data-link>Login</a>
        <a href="/register" class="btn-secondary" data-link>Register</a>
      </div>
    </div>
  `;
    return div;
};

// Routes configuration
const routes = {
    '/': { component: Home, guestOnly: true },
    '/login': {
        component: async () => {
            const { LoginPage } = await import('./pages/Login.js');
            return LoginPage();
        }, guestOnly: true
    },
    '/register': {
        component: async () => {
            const { RegisterPage } = await import('./pages/Register.js');
            return RegisterPage();
        }, guestOnly: true
    },
    '/dashboard': {
        component: async () => {
            const { Dashboard } = await import('./pages/Dashboard.js');
            return Dashboard();
        }, protected: true
    },
    '/complaint-success': {
        component: async () => {
            const { ComplaintSuccess } = await import('./pages/ComplaintSuccess.js');
            return ComplaintSuccess();
        }, protected: true
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Add Helpline Banner
    const banner = document.createElement('div');
    banner.className = 'helpline-banner';
    banner.innerHTML = '📞 24/7 Helpline: <strong>1800-123-4567</strong> | Emergency: <strong>112</strong>';
    document.body.prepend(banner);

    // Add CIPHER Branding
    const branding = document.createElement('div');
    branding.className = 'cipher-branding';
    branding.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
      <div style="font-size: 1.5rem; font-weight: 800; letter-spacing: 1px; color: var(--primary-color);">
        🛡️ CIPHER
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">
        Cybercrime Intelligence & Predictive Hotspot Engine For Response

      </div>
    </div>
  `;
    branding.style.cssText = `
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--glass-border);
    padding: 1rem 20px;
    position: sticky;
    top: 35px; /* Height of helpline banner approx */
    z-index: 999;
  `;
    document.body.prepend(branding);

    const router = new Router(routes);
    router.init();

    // Handle navigation links
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            router.navigateTo(e.target.getAttribute('href'));
        }
    });

    // Expose router to window for global access if needed
    window.router = router;
});
