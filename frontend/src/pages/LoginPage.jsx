import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, Loader2, KeyRound, ChevronLeft, SendHorizontal } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(0);

  const { user, login, requestOTP, loginWithOTP, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!otpMode) {
        // Normal Password Login
        await login(email, password);
        navigate('/');
      } else if (!otpSent) {
        // Request OTP
        await requestOTP(email);
        setOtpSent(true);
        setTimer(60); // 60s cooldown for resend
      } else {
        // Verify OTP
        await loginWithOTP(email, otpCode);
        navigate('/');
      }
    } catch (err) {
      // Error is handled in context
    }
  };

  const resetOTP = () => {
    setOtpSent(false);
    setOtpCode('');
    setTimer(0);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass animate-fade" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Purple Merit
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{otpMode ? 'Sign in with OTP' : 'MERN User Management System'}</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(!otpMode || !otpSent) ? (
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                disabled={otpSent}
                required
              />
            </div>
          ) : null}

          {(!otpMode) && (
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>
          )}

          {(otpMode && otpSent) && (
            <div className="animate-fade">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', color: 'var(--primary)' }} onClick={resetOTP}>
                <ChevronLeft size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Change Email</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Enter the 6-digit code sent to <b>{email}</b>
              </p>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Verification Code"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ paddingLeft: '3rem', letterSpacing: '0.5rem', fontWeight: 700 }}
                  required
                />
              </div>
              {timer > 0 ? (
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  Resend OTP in {timer}s
                </p>
              ) : (
                <button type="button" onClick={() => requestOTP(email)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'block', margin: '1rem auto 0', fontSize: '0.875rem', fontWeight: 600 }}>
                  Resend Code
                </button>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              otpMode ? (otpSent ? 'Verify & Login' : 'Send Verification Code') : 'Sign In'
            )}
            {!loading && <SendHorizontal size={18} style={{ marginLeft: '8px' }} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
           <button 
             onClick={() => { setOtpMode(!otpMode); resetOTP(); }} 
             style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
           >
             {otpMode ? <Lock size={16} /> : <KeyRound size={16} />}
             Sign in with {otpMode ? 'Password' : 'One-Time Password'}
           </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', transition: 'var(--transition)' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
