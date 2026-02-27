import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alertService } from '../services/alertService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, AlertOctagon } from 'lucide-react';

export default function Performance() {
    const { user } = useAuth();
    // Fallback data since mockData was removed
    const data = [
        { time: '00:00', transactions: 45 },
        { time: '04:00', transactions: 12 },
        { time: '08:00', transactions: 89 },
        { time: '12:00', transactions: 156 },
        { time: '16:00', transactions: 134 },
        { time: '20:00', transactions: 95 },
        { time: '23:59', transactions: 56 },
    ];

    const [activeCount, setActiveCount] = useState(0);

    useEffect(() => {
        const unsubscribe = alertService.subscribeToActive(user, (alerts) => {
            setActiveCount(alerts.length);
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Performance Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="panel" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Traffic (24h)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>2,458</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        <TrendingUp size={14} /> +12% from avg
                    </div>
                </div>
                <div className="panel" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Risk Index</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: activeCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {activeCount > 0 ? 'High' : 'Low'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: activeCount > 0 ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        <AlertOctagon size={14} /> {activeCount} active threats
                    </div>
                </div>
                <div className="panel" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Network Uptime</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>99.9%</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        <Activity size={14} /> Stable
                    </div>
                </div>
            </div>

            <div className="panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Transaction Volume vs Threat Correlation</h3>
                <div style={{ height: 400, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Area type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
