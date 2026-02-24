import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Info } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 48, height: 48,
                        background: 'var(--primary)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Shield color="white" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>LEA Secure Portal</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Authorized Personnel Only
                    </p>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'start'
                }}>
                    <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <strong>Demo Access:</strong><br />
                        Username: <code style={{ color: 'var(--primary)' }}>officer</code><br />
                        Password: <code style={{ color: 'var(--primary)' }}>password123</code>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Officer ID / Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter ID"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Secure Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                        Authenticate
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>First time access? </span>
                    <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                        Register Profile
                    </Link>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Connection is end-to-end encrypted
                </div>
            </div>
        </div>
    );
}
