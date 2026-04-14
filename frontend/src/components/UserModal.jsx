import React, { useState } from 'react';
import { X, Save, Loader2, Lock, ChevronDown } from 'lucide-react';

const UserModal = ({ user, onClose, onSave }) => {
  const isEdit = !!user?._id;
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    isActive: user?.isActive !== undefined ? user.isActive : true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!isEdit && formData.password.length < 8) e.password = 'Min 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSave(user?._id, formData);
    setSaving(false);
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: errors[key] ? 'var(--error)' : 'var(--text-muted)' }}>
        {label} {errors[key] && <span style={{ fontWeight: 400 }}>— {errors[key]}</span>}
      </label>
      <input
        type={type}
        value={formData[key]}
        placeholder={placeholder}
        onChange={(e) => { setFormData({ ...formData, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        style={{ borderColor: errors[key] ? 'var(--error)' : '' }}
        required={!isEdit || key !== 'password'}
      />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div className="glass animate-fade" style={{ position: 'relative', width: '100%', maxWidth: '520px', borderRadius: '1.5rem', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{isEdit ? 'Edit User' : 'Create New User'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              {isEdit ? `Editing ${user.firstName} ${user.lastName}` : 'Add a new user to the system'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}><X size={22} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('First Name', 'firstName')}
            {field('Last Name', 'lastName')}
          </div>
          {field('Email Address', 'email', 'email', 'user@example.com')}

          {!isEdit && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: errors.password ? 'var(--error)' : 'var(--text-muted)' }}>
                Password {errors.password && <span style={{ fontWeight: 400 }}>— {errors.password}</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" value={formData.password} placeholder="Min 8 characters" onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }); }} style={{ paddingLeft: '2.75rem', borderColor: errors.password ? 'var(--error)' : '' }} required />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Role</label>
              <div style={{ position: 'relative' }}>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ appearance: 'none', paddingRight: '2.5rem' }}>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Administrator</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Status</label>
              <div style={{ position: 'relative' }}>
                <select value={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} style={{ appearance: 'none', paddingRight: '2.5rem', borderColor: formData.isActive ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)', color: formData.isActive ? 'var(--success)' : 'var(--error)' }}>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn" style={{ flex: 1, background: 'var(--surface)', color: 'var(--text)' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={saving}>
              {saving ? <Loader2 size={17} className="animate-spin" /> : <><Save size={16} />{isEdit ? 'Save Changes' : 'Create User'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
