// /frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

// Import the page components you created
import AdminPage from './pages/Admin';
import UserListPage from './pages/UserList';
import BookingPage from './pages/Booking';
import MyBookingsPage from './pages/MyBookings';
import AdminBookingsPage from './pages/AdminBookings';
import ChatbotPage from './pages/Chatbot';
import LoginPage from './pages/Login';
import { useAuth } from './context/AuthContext';

const AppInner: React.FC = () => {
  const { user, logout } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header style={{ 
        padding: '16px 40px', 
        background: '#1c1c1c', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '25px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.7)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.6em', color: '#f39c12' }}>Modex Booking System</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.95em' }}>
          {user ? (
            <>
              {/* Links available to logged-in users */}
              {role === 'user' && (
                <>
                  <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>User View (List)</Link>
                  <Link to="/my-bookings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>My Bookings</Link>
                </>
              )}

              {/* Admin-only links */}
              {role === 'admin' && (
                <>
                  <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Admin (Create Show)</Link>
                  <Link to="/admin/bookings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Admin (Bookings)</Link>
                </>
              )}

              {/* Common link */}
              <Link to="/chat" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Chatbot</Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: '12px',
                  background: 'transparent',
                  border: '1px solid #f97316',
                  color: '#f97316',
                  padding: '6px 10px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Logout ({user.name})
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
          )}
        </nav>
      </header>

      <main style={{ padding: '32px 24px' }}>
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* /admin route (protected) */}
          <Route
            path="/admin"
            element={role === 'admin' ? <AdminPage /> : <Navigate to="/login" replace />}
          />

          {/* Admin booking records (protected) */}
          <Route
            path="/admin/bookings"
            element={role === 'admin' ? <AdminBookingsPage /> : <Navigate to="/login" replace />}
          />

          {/* Root route: / (requires login first) */}
          <Route
            path="/"
            element={user ? <UserListPage /> : <Navigate to="/login" replace />}
          /> 

          {/* User booking history (protected for user role) */}
          <Route
            path="/my-bookings"
            element={role === 'user' ? <MyBookingsPage /> : <Navigate to="/login" replace />}
          />

          {/* Chatbot assistant */}
          <Route path="/chat" element={<ChatbotPage />} />

          {/* Dynamic booking route: /booking/1, /booking/2, etc. */}
          <Route path="/booking/:id" element={<BookingPage />} /> 
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AppInner />
  </Router>
);

export default App;
