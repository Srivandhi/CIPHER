import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, History, BarChart3, User, LogOut } from 'lucide-react';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 2rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '6px' }}>
                        <Shield color="white" size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>LEA Portal</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v2.2 Single-Unit</div>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <NavLink to="/" className={({ isActive }) => `btn btn-outline ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `btn btn-outline ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <History size={18} /> Case History
                    </NavLink>
                    <NavLink to="/performance" className={({ isActive }) => `btn btn-outline ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BarChart3 size={18} /> Performance
                    </NavLink>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                    <NavLink to="/profile" className={({ isActive }) => `btn btn-outline ${isActive ? 'active-nav' : ''}`} style={{ justifyContent: 'flex-start', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <User size={18} /> My Profile
                    </NavLink>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        {user.atmId}
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
                        <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
