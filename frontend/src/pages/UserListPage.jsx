import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, UserPlus, Download, Filter, ChevronDown } from 'lucide-react';
import UserModal from '../components/UserModal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const UserListPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, keyword });
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('isActive', statusFilter);
      const { data } = await api.get(`/users?${params.toString()}`);
      setUsers(data.users);
      setPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      toast.success(`${deleteTarget.firstName} ${deleteTarget.lastName} has been removed.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      setDeleteTarget(null);
    }
  };

  const handleSave = async (id, updatedData) => {
    try {
      if (id) {
        await api.put(`/users/${id}`, updatedData);
        toast.success('User updated successfully!');
      } else {
        await api.post('/users', updatedData);
        toast.success('New user created successfully!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get('/users/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported to CSV!');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const getRoleBadge = (role) => <span className={`badge badge-${role}`}>{role}</span>;
  const getStatusBadge = (isActive) => <span className={`badge ${isActive ? 'badge-active' : 'badge-disabled'}`}>{isActive ? 'Active' : 'Disabled'}</span>;

  return (
    <div>
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {total > 0 ? `${total} users in the system` : 'Manage accounts, roles, and access.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleExport} disabled={exporting} className="btn" style={{ background: 'var(--surface)', color: 'var(--text)', gap: '0.5rem' }}>
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export CSV
          </button>
          <button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="btn btn-primary">
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
        {/* ─── Search + Filters ─── */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              id="user-search"
              placeholder="Search by name or email..."
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <div style={{ position: 'relative', minWidth: '140px' }}>
            <Filter size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} style={{ paddingLeft: '2.5rem', paddingRight: '2rem', appearance: 'none' }}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'relative', minWidth: '140px' }}>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ paddingRight: '2rem', appearance: 'none' }}>
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Disabled</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* ─── Table ─── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '10px' }} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ fontWeight: 600 }}>No users found</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>User</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Created By</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Joined</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.925rem' }}>{u.firstName} {u.lastName}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>{getRoleBadge(u.role)}</td>
                      <td style={{ padding: '1rem' }}>{getStatusBadge(u.isActive)}</td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {u.createdBy ? `${u.createdBy.firstName} ${u.createdBy.lastName}` : 'Self-registered'}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button id={`edit-user-${u._id}`} onClick={() => { setSelectedUser(u); setIsModalOpen(true); }} className="btn" title="Edit User"
                            style={{ padding: '0.5rem', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
                          >
                            <Edit2 size={15} color="var(--primary)" />
                          </button>
                          <button id={`delete-user-${u._id}`} onClick={() => setDeleteTarget(u)} className="btn" title="Delete User"
                            style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                          >
                            <Trash2 size={15} color="var(--error)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── Pagination ─── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing {users.length} of <strong>{total}</strong> users — Page {page} of {pages}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn" style={{ padding: '0.5rem 0.75rem', background: 'var(--surface)', opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className="btn" style={{ padding: '0.5rem 0.875rem', background: p === page ? 'var(--primary)' : 'var(--surface)', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                    {p}
                  </button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn" style={{ padding: '0.5rem 0.75rem', background: 'var(--surface)', opacity: page === pages ? 0.4 : 1 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Modals ─── */}
      {isModalOpen && (
        <UserModal user={selectedUser} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to permanently delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`}
          confirmLabel="Delete User"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default UserListPage;
