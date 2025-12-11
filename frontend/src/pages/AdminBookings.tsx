// /frontend/src/pages/AdminBookings.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface AdminBookingRecord {
  id: number;
  show_name: string;
  theatre_name: string;
  user_id: string;
  seat_count: number;
  status: 'CONFIRMED' | 'FAILED' | 'PENDING';
  created_at: string;
}

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'FAILED' | 'PENDING'>('ALL');
  const [searchShow, setSearchShow] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchAllBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get<AdminBookingRecord[]>(`${API_BASE_URL}/admin/bookings`);
        setBookings(response.data);
      } catch (err) {
        setError('Could not load booking records. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesShow = b.show_name.toLowerCase().includes(searchShow.toLowerCase());
    return matchesStatus && matchesShow;
  });

  const renderStatusBadge = (status: AdminBookingRecord['status']) => {
    const baseStyle: React.CSSProperties = {
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '0.8rem',
      fontWeight: 600,
      letterSpacing: '0.03em',
    };

    if (status === 'CONFIRMED') {
      return <span style={{ ...baseStyle, background: '#1e824c', color: '#ecf0f1' }}>CONFIRMED</span>;
    }
    if (status === 'FAILED') {
      return <span style={{ ...baseStyle, background: '#c0392b', color: '#ecf0f1' }}>FAILED</span>;
    }
    return <span style={{ ...baseStyle, background: '#f39c12', color: '#1c1c1c' }}>PENDING</span>;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#fbbf24', marginBottom: '10px' }}>Admin Booking Records</h2>
      <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
        View all bookings across shows. Use filters to quickly inspect recent activity and spot overbooking issues.
      </p>

      {/* Filters */}
      <div
        style={{
          background: 'radial-gradient(circle at top left, #1f2937, #020617)',
          padding: '18px 22px',
          borderRadius: '16px',
          marginBottom: '25px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center',
          border: '1px solid #374151',
        }}
      >
        <div style={{ flex: '1 1 220px' }}>
          <label style={{ color: '#e5e7eb', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>
            Filter by Show Name
          </label>
          <input
            type="text"
            value={searchShow}
            onChange={e => setSearchShow(e.target.value)}
            placeholder="e.g., Inception"
          />
        </div>

        <div style={{ flex: '0 0 220px' }}>
          <label style={{ color: '#ccc', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>
            Booking Status
          </label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #4b5563',
              background: '#111827',
              color: '#e5e7eb',
              width: '100%',
            }}
          >
            <option value="ALL">All</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {loading && <div style={{ color: '#e5e7eb' }}>Loading booking records...</div>}
      {error && <div style={{ color: '#f97316', marginBottom: '10px' }}>Error: {error}</div>}

      {!loading && filtered.length === 0 && !error && (
        <div style={{ color: '#9ca3af' }}>No booking records match the current filters.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div
          style={{
            background: 'radial-gradient(circle at top left, #020617, #020617)',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            border: '1px solid #374151',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: '#1f1f1f' }}>
              <tr>
                <th style={{ padding: '12px 10px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px 10px', textAlign: 'left' }}>Show / Theatre</th>
                <th style={{ padding: '12px 10px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Seats</th>
                <th style={{ padding: '12px 10px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, idx) => (
                <tr
                  key={b.id}
                  style={{ background: idx % 2 === 0 ? '#2b2b2b' : '#262626', borderTop: '1px solid #333' }}
                >
                  <td style={{ padding: '10px' }}>#{b.id}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600 }}>{b.show_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{b.theatre_name}</div>
                  </td>
                  <td style={{ padding: '10px', fontSize: '0.8rem' }}>{b.user_id}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>{b.seat_count}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{renderStatusBadge(b.status)}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontSize: '0.8rem' }}>{formatDate(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
