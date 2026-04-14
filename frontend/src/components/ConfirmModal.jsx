import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', isDanger = true }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '1rem',
    }}>
      <div className="glass animate-fade" style={{
        width: '100%', maxWidth: '440px', borderRadius: '1.5rem',
        padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <AlertTriangle size={24} color="var(--error)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
            </div>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn" style={{ background: 'var(--surface)', color: 'var(--text)', padding: '0.625rem 1.5rem' }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              background: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary)',
              color: isDanger ? 'var(--error)' : 'white',
              border: isDanger ? '1px solid rgba(239,68,68,0.3)' : 'none',
              padding: '0.625rem 1.5rem',
              fontWeight: 700,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
