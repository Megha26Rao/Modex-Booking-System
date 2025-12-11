// /frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = userId.trim();
    const trimmedPassword = password.trim();
    if (!trimmedId || !trimmedPassword) return;

    // NOTE: This is mock auth on the frontend only.
    // You can later swap this with a real backend check.
    login(trimmedId, role);

    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'radial-gradient(circle at top left, #1f2937, #020617)',
          borderRadius: '16px',
          border: '1px solid #374151',
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
          padding: '28px 26px',
        }}
      >
        <h2 style={{ color: '#fbbf24', marginTop: 0, marginBottom: '4px' }}>Sign in to Modex</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '0.9rem' }}>
          Enter your ID and password, and choose whether you are a User or Admin.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: '#e5e7eb', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your ID"
            />
          </div>

          <div>
            <label style={{ color: '#e5e7eb', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label style={{ color: '#e5e7eb', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Role</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ color: '#e5e7eb', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                />
                User
              </label>
              <label style={{ color: '#e5e7eb', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />
                Admin
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
