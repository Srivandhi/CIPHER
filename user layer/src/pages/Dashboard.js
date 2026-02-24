import { api } from '../services/mockApi.js';

export const Dashboard = async () => {
  const user = api.getCurrentUser();
  if (!user) {
    window.router.navigateTo('/login');
    return document.createElement('div');
  }

  const container = document.createElement('div');
  container.className = 'dashboard-container animate-fade-in';

  // Add specific dashboard styles
  const style = document.createElement('style');
  style.textContent = `
    .dashboard-container {
      display: flex;
      gap: 2rem;
      width: 100%;
      height: calc(100vh - 100px);
      margin-top: 2rem;
    }
    .sidebar {
      width: 250px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding-right: 1rem;
    }
    .nav-item {
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-item:hover {
      background: rgba(14, 165, 233, 0.1);
      color: var(--primary-hover);
    }
    .nav-item.active {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
    }
    .user-profile {
      padding: 1rem;
      border-bottom: 1px solid var(--glass-border);
      margin-bottom: 1rem;
    }
  `;
  container.appendChild(style);

  container.innerHTML += `
    <aside class="glass-panel sidebar">
      <div class="user-profile">
        <h3 style="margin-bottom: 0.25rem;">${user.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Aadhaar: ${user.aadhaar}</p>
      </div>
      
      <nav>
        <a href="#" class="nav-item active" data-view="home">🏠 Home</a>
        <a href="#" class="nav-item" data-view="upload">📝 Upload Complaint</a>
        <a href="#" class="nav-item" data-view="view">👀 View Status</a>
        <a href="#" class="nav-item" data-view="history">📜 History</a>
        <a href="#" class="nav-item" data-view="profile">👤 Edit Profile</a>
        <div style="flex: 1"></div>
        <a href="#" class="nav-item" id="logoutBtn" style="color: #ff6b6b; margin-top: auto;">🚪 Logout</a>
      </nav>
    </aside>
    
    <main class="main-content" id="dashboardContent">
      <!-- Dynamic Content Loaded Here -->
    </main>
  `;

  // Event Listeners
  const navItems = container.querySelectorAll('.nav-item[data-view]');
  const contentArea = container.querySelector('#dashboardContent');
  const logoutBtn = container.querySelector('#logoutBtn');

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    api.logout();
  });

  const loadView = async (viewName) => {
    // Update active state
    navItems.forEach(item => {
      if (item.dataset.view === viewName) item.classList.add('active');
      else item.classList.remove('active');
    });

    contentArea.innerHTML = '<div style="text-align:center; padding: 2rem;">Loading...</div>';

    let component;
    switch (viewName) {
      case 'home':
        const { HomePage } = await import('./HomePage.js');
        component = await HomePage();
        break;
      case 'upload':
        const { UploadComplaint } = await import('./UploadComplaint.js');
        component = await UploadComplaint();
        break;
      case 'view':
        const { ViewComplaints } = await import('./ViewComplaints.js');
        component = await ViewComplaints();
        break;
      case 'history':
        const { History } = await import('./History.js');
        component = await History();
        break;
      case 'profile':
        const { Profile } = await import('./Profile.js');
        component = await Profile();
        break;
    }

    contentArea.innerHTML = '';
    if (component) {
      contentArea.appendChild(component);
    }
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      loadView(item.dataset.view);
    });
  });

  // Load default view
  // Load view based on URL param or default to home
  const params = new URLSearchParams(window.location.search);
  const initialView = params.get('view');
  const validViews = ['home', 'upload', 'view', 'history', 'profile'];

  if (initialView && validViews.includes(initialView)) {
    loadView(initialView);
  } else {
    loadView('home');
  }

  return container;
};
