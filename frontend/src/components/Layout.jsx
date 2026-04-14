import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserCircle, LogOut, ShieldCheck, Menu, X
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'moderator', 'user'] },
    { name: 'User Management', icon: Users, path: '/users', roles: ['admin'] },
    { name: 'Profile', icon: UserCircle, path: '/profile', roles: ['admin', 'moderator', 'user'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ─── Sidebar ─── */}
      <aside className="glass" style={{
        width: isSidebarOpen ? '270px' : '76px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        padding: '1.5rem 1rem',
        borderRight: '1px solid var(--glass-border)',
        zIndex: 50, backdropFilter: 'blur(30px)',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2.5rem', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '40px', height: '40px', minWidth: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck color="white" size={22} />
          </div>
          {isSidebarOpen && <h2 style={{ fontSize: '1.2rem', fontWeight: 800, whiteSpace: 'nowrap' }}>Purple Merit</h2>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {filteredItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderRadius: '12px', textDecoration: 'none',
                color: isActive ? 'white' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                boxShadow: isActive ? '0 4px 15px rgba(168, 85, 247, 0.3)' : 'none',
                transition: 'var(--transition)',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden',
              })}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} className="btn" style={{ marginTop: 'auto', width: '100%', justifyContent: isSidebarOpen ? 'flex-start' : 'center', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.15)', padding: '0.875rem 1rem' }}>
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* ─── Main Content ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40 }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn" style={{ padding: '0.5rem', background: 'var(--surface)' }}>
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 0 0 3px rgba(168,85,247,0.2)' }}>
              {initials}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div className="animate-fade">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
