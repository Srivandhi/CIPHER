import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Briefcase } from 'lucide-react';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        atmId: user.atmId || '',
        zone: user.zone || '',
        password: ''
    });
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({
            name: formData.name,
            email: formData.email,
            atmId: formData.atmId,
            zone: formData.zone,
        });
        setSuccess('Profile updated successfully.');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Officer Profile</h1>

            <div className="panel" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    {success && (
                        <div style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                            {success}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Badge Number</label>
                            <input value={user.badgeNumber} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Official Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Briefcase size={16} /> Assignment Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</label>
                                <div style={{ fontWeight: 600 }}>{user.role}</div>
                            </div>

                            {user.role === 'Police Officer' ? (
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jurisdiction Zone</label>
                                    <div style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{user.zone}</div>
                                </div>
                            ) : (
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned ATM Unit</label>
                                    <div style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{user.atmId}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr style={{ borderColor: 'var(--border)', margin: '2rem 0' }} />

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
