import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        badgeNumber: '',
        role: 'ATM Officer',
        zone: '',
        bankName: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.name) {
            setError('Please fill in all required fields.');
            return;
        }

        const result = register(formData);
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
                        background: 'var(--accent)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <UserPlus color="white" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Officer Registration</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Assign to Bank Command Unit or Police Station
                    </p>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                        </div>
                        <div className="form-group">
                            <label>Badge Number</label>
                            <input name="badgeNumber" value={formData.badgeNumber} onChange={handleChange} placeholder="1234" />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Officer Role</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'ATM Officer', zone: '', bankName: '' })}
                                className={`btn ${formData.role === 'ATM Officer' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Bank Command Unit
                            </button>
                            
                        </div>
                    </div>

                    {formData.role === 'ATM Officer' ? (
                        <div className="form-group">
                            <label>Bank Name</label>
                            <input
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                placeholder="e.g. PNB, HDFC"
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    background: 'var(--bg-dark)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Alerts will filter by ATMs starting with this name.
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Jurisdiction (Zone)</label>
                            <input
                                name="zone"
                                value={formData.zone}
                                onChange={handleChange}
                                placeholder="e.g. Mumbai City, Maharashtra"
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    background: 'var(--bg-dark)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Must match exact zone name in control records.
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} placeholder="officer2" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', background: 'var(--accent)' }}>
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Already have an ID? </span>
                    <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
