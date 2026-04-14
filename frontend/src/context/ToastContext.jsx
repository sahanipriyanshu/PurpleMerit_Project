import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => (
  <div style={{
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    pointerEvents: 'none',
  }}>
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`toast toast-${t.type}`}
        style={{ pointerEvents: 'all' }}
        onClick={() => onRemove(t.id)}
      >
        <span className="toast-icon">
          {t.type === 'success' && '✓'}
          {t.type === 'error' && '✕'}
          {t.type === 'warning' && '⚠'}
          {t.type === 'info' && 'ℹ'}
        </span>
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

export default ToastContext;
