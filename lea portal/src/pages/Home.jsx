import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alertService } from '../services/alertService';
import { AlertCircle, CheckCircle, RefreshCw, MonitorDot, ShieldAlert } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Subscribe to real-time updates
        const unsubscribe = alertService.subscribeToActive(user, (data) => {
            setAlerts(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleComplete = (alert) => {
        if (confirm('Confirm intervention? This will log the incident as resolved.')) {
            // Service handles the update and notification, which triggers the subscription above
            alertService.resolveAlert(alert);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem' }}>
                        {user.role === 'Police Officer' ? 'Zone Command Center' : `${user.bankName} Command Portal`}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user.role === 'Police Officer' ? <ShieldAlert size={16} color="var(--primary)" /> : <MonitorDot size={16} color="var(--primary)" />}
                        {user.role === 'Police Officer' ? `Jurisdiction: ${user.zone}` : `Bank Unit: ${user.bankName}`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)' }}>
                        <span className="pulse-dot"></span> Real-time Feed Active
                    </span>
                </div>
            </div>

            <div className="panel">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} color="var(--danger)" />
                        Active Predictive Alerts
                    </h3>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Connecting to Control Stream...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ minWidth: '100%' }}>
                            <thead>
                                <tr>
                                    <th>ATM Details</th>
                                    <th>Risk Assessment</th>
                                    <th>Location</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map(alert => (
                                    <tr key={alert.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                                                {alert.atmName || 'Unknown ATM'}
                                            </div>
                                            <div style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.875rem' }}>
                                                {/* Use complaint_id if available, fallback to caseId */}
                                                Comp ID: {alert.complaint_id || alert.caseId}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span className="badge" style={{
                                                    color: alert.probability > 0.9 ? 'var(--danger)' : 'var(--warning)',
                                                    background: alert.probability > 0.9 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                                    fontWeight: 700
                                                }}>
                                                    {(alert.probability * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: alert.riskClass === 'High' ? 'var(--danger)' : 'var(--text-muted)'
                                            }}>
                                                Risk Class: {alert.riskClass || (alert.probability > 0.9 ? 'High' : 'Medium')}
                                            </div>
                                        </td>
                                        <td>{alert.location}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '6px 16px', fontSize: '0.875rem' }}
                                                onClick={() => handleComplete(alert)}
                                            >
                                                <CheckCircle size={14} style={{ marginRight: '6px' }} /> Resolve
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {alerts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No active threats detected in this sector.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
