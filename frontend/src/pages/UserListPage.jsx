import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, UserPlus } from 'lucide-react';
import UserModal from '../components/UserModal';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, keyword]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users?page=${page}&keyword=${keyword}`);
      setUsers(data.users);
      setPages(data.pages);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  const handleSave = async (id, updatedData) => {
    try {
      if (id) {
        await api.put(`/users/${id}`, updatedData);
      } else {
        await api.post(`/users`, updatedData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user', error);
      alert(error.response?.data?.message || 'Error saving user');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage system users, roles, and account status.</p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
        <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontSize: '0.875rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem' }}>User</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <p style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '1rem', 
                          background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: user.role === 'admin' ? 'var(--primary)' : 'var(--text)',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: user.isActive ? 'var(--success)' : 'var(--error)' 
                          }}></div>
                          <span style={{ fontSize: '0.875rem' }}>{user.isActive ? 'Active' : 'Disabled'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                            className="btn" 
                            style={{ padding: '0.5rem', background: 'var(--surface)' }}
                          >
                            <Edit2 size={16} color="var(--primary)" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="btn" 
                            style={{ padding: '0.5rem', background: 'var(--surface)' }}
                          >
                            <Trash2 size={16} color="var(--error)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Showing page {page} of {pages}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="btn" 
                  style={{ padding: '0.5rem', background: 'var(--surface)', opacity: page === 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  disabled={page === pages}
                  onClick={() => setPage(p => p + 1)}
                  className="btn" 
                  style={{ padding: '0.5rem', background: 'var(--surface)', opacity: page === pages ? 0.5 : 1 }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default UserListPage;
