import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Users, ShieldAlert, CheckCircle, Clock, TrendingUp, Activity, Smartphone } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { name: 'Total Users', value: '1,284', icon: Users, color: 'var(--primary)', trend: '+12.5%' },
    { name: 'Active Sessions', value: '42', icon: Activity, color: 'var(--secondary)', trend: '+5.2%' },
    { name: 'Security Score', value: '98%', icon: ShieldAlert, color: 'var(--accent)', trend: 'Stable' },
    { name: 'API Status', value: 'Healthy', icon: CheckCircle, color: 'var(--success)', trend: '100%' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            Hello, <span style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.firstName}</span>!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>System diagnostics and user activity overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
            Live Server
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass animate-fade" style={{ padding: '1.5rem', borderRadius: '1.25rem', animationDelay: `${i * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
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
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: stat.color === 'var(--error)' ? 'var(--error)' : 'var(--success)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', alignSelf: 'flex-start' }}>
                {stat.trend}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.name}</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>System Usage</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--surface)' }}>Weekly</button>
               <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Monthly</button>
            </div>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--glass-border)', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <TrendingUp size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.875rem' }}>Analytical data visualization will be loaded here.</p>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Recent Logins</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={20} color="var(--text-muted)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Mobile Login</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago • Bangalore, IN</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
