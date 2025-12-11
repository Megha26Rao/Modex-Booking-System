// /frontend/src/pages/MyBookings.tsx - FINALIZED
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 

interface BookingRecord {
    id: number;
    show_name: string;
    theatre_name: string;
    user_id: string; // The composite string
    seat_count: number;
    status: 'CONFIRMED' | 'FAILED' | 'PENDING';
    created_at: string;
}

const MyBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to format date without seconds
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    useEffect(() => {
        const fetchBookings = async () => {

            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/bookings`); // Use the full list

                // If a user is present, show only that user's bookings; otherwise, show all
                const filteredBookings = user
                    ? response.data.filter((b: BookingRecord) =>
                        b.user_id.startsWith(`Name: ${user.name}`)
                      )
                    : response.data;

                setBookings(filteredBookings);
            } catch (err) {
                setError('Could not fetch booking history. Please ensure the backend is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (loading) {
        return <div style={{ padding: '20px', color: '#ccc' }}>Loading your booking history...</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ color: '#fbbf24', borderBottom: '1px solid #4b5563', paddingBottom: '10px' }}>Your Booking Status</h2>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {bookings.length === 0 ? (
                <p style={{ color: '#9ca3af' }}>
                    You have no recorded bookings yet
                    {user && <> under the name: **{user.name}**</>}.
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {bookings.map(booking => {
                        const statusColor = booking.status === 'CONFIRMED'
                            ? '#22c55e'
                            : booking.status === 'FAILED'
                            ? '#f97316'
                            : '#eab308';

                        return (
                            <div
                                key={booking.id}
                                className="show-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    padding: '18px 22px',
                                }}
                            >
                                {/* Header row: ID + status pill */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Booking ID</div>
                                    <span
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.06em',
                                            background: statusColor,
                                            color: '#020617',
                                        }}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>
                                    #{booking.id} &mdash; {booking.show_name}
                                </div>

                                {/* Show + seats info */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem' }}>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Theatre</div>
                                        <div>{booking.theatre_name}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Seats Booked</div>
                                        <div style={{ fontWeight: 600 }}>{booking.seat_count}</div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ height: 1, background: '#4b5563', margin: '8px 0' }} />

                                {/* Meta info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#9ca3af' }}>
                                    <div>Customer Info: {booking.user_id}</div>
                                    <div>Booked on: {formatDate(booking.created_at)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
export {};