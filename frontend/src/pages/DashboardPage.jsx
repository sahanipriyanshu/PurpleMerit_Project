import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Users, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { name: 'Total Users', value: '1,284', icon: Users, color: 'var(--primary)' },
    { name: 'Active Sessions', value: '42', icon: Clock, color: 'var(--secondary)' },
    { name: 'System Security', value: 'Highest', icon: ShieldAlert, color: 'var(--success)' },
    { name: 'Server Status', value: 'Operational', icon: CheckCircle, color: 'var(--accent)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Welcome back, {user?.firstName}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your system today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ 
              background: `${stat.color}15`, 
              color: stat.color,
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.name}</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', minHeight: '300px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>
          <Clock size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Activity logging will appear here once users start interacting.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
