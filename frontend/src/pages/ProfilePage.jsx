import React, { useState, useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { User, Mail, Shield, Save, Loader2, Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

// ─── Password Strength ────────────────────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: 'Weak', color: 'var(--error)' },
    { label: 'Fair', color: 'var(--warning)' },
    { label: 'Good', color: 'var(--accent)' },
    { label: 'Strong', color: 'var(--success)' },
  ];
  return { score, ...levels[score - 1] || levels[0] };
};

const PasswordRule = ({ met, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: met ? 'var(--success)' : 'var(--text-muted)', transition: 'color 0.3s' }}>
    {met ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
    {label}
  </div>
);

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password && formData.password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setLoading(true);
    try {
      const updateData = { firstName: formData.firstName, lastName: formData.lastName };
      if (formData.password) updateData.password = formData.password;
      const { data } = await api.put('/users/profile', updateData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Account Settings</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your personal information and security preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>

        {/* ─── Profile Card ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, boxShadow: '0 0 0 4px rgba(168,85,247,0.2)' }}>
              {initials}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{user?.firstName} {user?.lastName}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1.25rem' }}>{user?.email}</p>
            <div className={`badge badge-${user?.role}`} style={{ margin: '0 auto', display: 'inline-flex' }}>
              <Shield size={11} />
              {user?.role}
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Account Info</h4>
            {[
              { label: 'Status', value: 'Active & Verified', color: 'var(--success)' },
              { label: 'Role', value: user?.role, color: 'var(--primary)' },
              { label: 'Auth Method', value: 'Password / OTP', color: 'var(--text)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid var(--glass-border)' : 'none' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Edit Form ─── */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--primary)" /> Personal Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {[
                { field: 'firstName', label: 'First Name' },
                { field: 'lastName', label: 'Last Name' },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{label}</label>
                  <input id={field} type="text" value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} required />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" value={formData.email} style={{ paddingLeft: '2.75rem', opacity: 0.5 }} readOnly disabled />
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} color="var(--primary)" /> Security
            </h4>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>New Password <span style={{ fontWeight: 400 }}>(leave blank to keep current)</span></label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="new-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {formData.password && (
                <div className="animate-fade">
                  <div className="strength-bar" style={{ marginTop: '0.75rem' }}>
                    <div className="strength-bar-fill" style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <PasswordRule met={formData.password.length >= 8} label="8+ chars" />
                      <PasswordRule met={/[A-Z]/.test(formData.password)} label="Uppercase" />
                      <PasswordRule met={/[0-9]/.test(formData.password)} label="Number" />
                      <PasswordRule met={/[^A-Za-z0-9]/.test(formData.password)} label="Symbol" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {formData.password && (
              <div className="animate-fade">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} style={{ paddingLeft: '2.75rem', borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? 'var(--error)' : '' }} required />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p style={{ color: 'var(--error)', fontSize: '0.78rem', marginTop: '0.4rem' }}>Passwords do not match</p>
                )}
              </div>
            )}

            <button type="submit" id="save-profile" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '0.875rem 2.5rem', marginTop: '0.5rem' }}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
