import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, ShieldCheck, UserCog, TrendingUp, Loader2, ArrowUpRight } from 'lucide-react';

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const StatCardSkeleton = () => (
  <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '1.25rem' }} />
    <div className="skeleton" style={{ width: '60%', height: '14px', borderRadius: '6px', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ width: '40%', height: '28px', borderRadius: '6px' }} />
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{payload[0].value} new users</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/users/stats')
        .then(({ data }) => setStats(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const statCards = stats ? [
    {
      name: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'var(--primary)',
      bg: 'rgba(168, 85, 247, 0.12)',
      trend: `+${stats.newThisMonth} this month`,
      positive: true,
    },
    {
      name: 'Active Accounts',
      value: stats.active,
      icon: UserCheck,
      color: 'var(--success)',
      bg: 'rgba(16, 185, 129, 0.12)',
      trend: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total`,
      positive: true,
    },
    {
      name: 'Administrators',
      value: stats.admins,
      icon: ShieldCheck,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      trend: 'Full access',
    },
    {
      name: 'Moderators',
      value: stats.moderators,
      icon: UserCog,
      color: 'var(--accent)',
      bg: 'rgba(6, 182, 212, 0.12)',
      trend: 'Limited access',
    },
  ] : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            Hello,{' '}
            <span style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.firstName}!
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {user?.role === 'admin' ? "Here's your system overview for today." : 'Welcome back to your workspace.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
            API Healthy
          </div>
          <div className={`badge badge-${user?.role}`}>{user?.role}</div>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      {user?.role === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {loading
            ? [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
            : statCards.map((stat, i) => (
              <div key={i} className="glass animate-fade" style={{ padding: '1.5rem', borderRadius: '1.25rem', animationDelay: `${i * 0.1}s`, transition: 'var(--transition)', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ background: stat.bg, color: stat.color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.positive ? 'var(--success)' : 'var(--text-muted)', background: stat.positive ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {stat.positive && <ArrowUpRight size={12} />}
                    {stat.trend}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{stat.name}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</h3>
              </div>
            ))
          }
        </div>
      )}

      {/* ─── Chart + Recent ─── */}
      {user?.role === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>

          {/* Area Chart */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>User Registrations</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Last 6 months</p>
              </div>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: '260px', borderRadius: '12px' }} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={stats?.monthlyData || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2.5} fill="url(#colorUsers)" dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#ec4899' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Users */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>System Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Architecture', value: 'MERN Stack' },
                { label: 'Auth', value: 'JWT + OTP' },
                { label: 'Access Control', value: 'Role-based (RBAC)' },
                { label: 'API Version', value: 'v1' },
                { label: 'Password Hashed', value: 'bcryptjs (10 rounds)' },
                { label: 'Rate Limiting', value: '100 req / 15 min' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Non-admin welcome */}
      {user?.role !== 'admin' && (
        <div className="glass animate-fade" style={{ padding: '3rem', borderRadius: '1.5rem', textAlign: 'center', maxWidth: '500px', margin: '4rem auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
          <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>You're all set!</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Head to your <strong>Profile</strong> to update your name or change your password. Contact an admin if you need elevated permissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
