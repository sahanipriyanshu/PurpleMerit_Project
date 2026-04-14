import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut, 
  ShieldCheck, 
  Menu,
  X
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'moderator', 'user'] },
    { name: 'User Management', icon: Users, path: '/users', roles: ['admin'] },
    { name: 'Profile', icon: UserCircle, path: '/profile', roles: ['admin', 'moderator', 'user'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ 
        width: isSidebarOpen ? '280px' : '80px', 
        transition: 'var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        borderRight: '1px solid var(--glass-border)',
        zIndex: 50,
        backdropFilter: 'blur(30px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', overflow: 'hidden' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck color="white" size={24} />
          </div>
          {isSidebarOpen && <h2 style={{ fontSize: '1.25rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Purple Mint</h2>}
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'white' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                boxShadow: isActive ? '0 4px 15px rgba(168, 85, 247, 0.3)' : 'none',
                transition: 'var(--transition)',
                marginBottom: '0.5rem',
                whiteSpace: 'nowrap',
                fontWeight: isActive ? 600 : 400
              })}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="btn"
          style={{ 
            marginTop: 'auto',
            width: '100%',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--error)'
          }}
        >
          <LogOut size={22} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn" 
            style={{ padding: '0.5rem', background: 'var(--surface)' }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--primary)'
            }}>
              <UserCircle size={28} color="var(--primary)" />
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
