// /frontend/src/components/UserProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; 

const UserProfile: React.FC = () => {
    const { user, login, logout } = useAuth();
    const [nameInput, setNameInput] = useState('');

    if (user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>Welcome, {user.name}</span>
                <Link to="/bookings" style={{ color: '#fff', textDecoration: 'none' }}>My Bookings</Link>
                <button 
                    onClick={logout} 
                    className="btn-primary" 
                    style={{ background: '#e74c3c' }}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); login(nameInput,'user'); }} style={{ display: 'flex', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Enter Name to Login" 
                value={nameInput} 
                onChange={(e) => setNameInput(e.target.value)}
                required
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" className="btn-primary">Mock Login</button>
        </form>
    );
};

export default UserProfile;
// FIX: Adding this line resolves TS1208
export {};