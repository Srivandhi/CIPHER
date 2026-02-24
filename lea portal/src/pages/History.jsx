import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alertService } from '../services/alertService';

export default function History() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = alertService.subscribeToHistory(user, (data) => {
            setHistory(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Case Resolution History</h1>

            <div className="panel">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ minWidth: '100%' }}>
                            <thead>
                                <tr>
                                    <th>ATM Name</th>
                                    <th>Complaint ID</th>
                                    <th>Risk Assessment</th>
                                    <th>Resolved Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 600 }}>
                                            {item.atmName}
                                            <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                                                {item.location}
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'monospace' }}>{item.complaint_id}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className="badge" style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    {(item.probability * 100).toFixed(1)}%
                                                </span>
                                                <span style={{ fontSize: '0.875rem' }}>{item.riskClass}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                                        <td>
                                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Resolved</span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No resolved cases in history.
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
