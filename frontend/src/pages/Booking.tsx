// /frontend/src/pages/Booking.tsx
import React, { useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useShows } from '../context/ShowContext';
import { useAuth } from '../context/AuthContext'; 

const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const showId = id ? parseInt(id, 10) : undefined;
    const { shows, bookSeats } = useShows();
    const { user } = useAuth(); 

    const [userName, setUserName] = useState(user?.name || ''); 
    const [userPhone, setUserPhone] = useState('');
    const [seatCount, setSeatCount] = useState(0); // Seat count is driven by selected seats

    const [bookingMessage, setBookingMessage] = useState<React.ReactNode>(''); 
    const [isBooking, setIsBooking] = useState(false);
    
    const show = shows.find(s => s.id === showId); 

    // Simple mocked seat layout: 8 rows x 10 seats
    const rows = ['A','B','C','D','E','F','G','H'];
    const seatsPerRow = 10;

    // Some demo booked seats: first row A1-A4 and center cluster in row D
    const bookedSeats = useMemo(() => new Set<string>([
        'A1','A2','A3','A4','D5','D6','D7'
    ]), []);

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    if (!showId || !show) {
        return <div style={{ padding: '20px' }}>Loading show details or invalid show ID...</div>;
    }

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        const bookingCount = seatCount; // number of selected seats
        
        if (show.total_seats < bookingCount || bookingCount <= 0) { 
            setBookingMessage(<span style={{ color: 'yellow' }}>Please select at least one available seat. Remaining overall seats: {show.total_seats}.</span>);
            return;
        }

        if (!userName || !userPhone || userPhone.length < 10 || isNaN(bookingCount)) {
            setBookingMessage(<span style={{ color: 'yellow' }}>Please provide valid details and seat count.</span>);
            return;
        }

        setIsBooking(true);
        setBookingMessage('Processing booking...');

        // Final call with 4 arguments
        const resultMessage = await bookSeats(showId, userName, userPhone, bookingCount); 

        if (resultMessage.includes("Booking Failed")) { 
            setBookingMessage(<span style={{ color: 'red', fontWeight: 'bold' }}>BOOKING FAILED: {resultMessage}</span>);
        } else {
            setBookingMessage(<span style={{ color: 'green', fontWeight: 'bold' }}>{resultMessage}</span>);
        }
        setIsBooking(false);
    };

    const isSoldOut = show.total_seats <= 0;

    const buttonClass = isSoldOut ? 'btn-disabled' : 'btn-primary';

    return (
        <div className="show-card" style={{ maxWidth: '640px', margin: '0 auto' }}>

            <h2 style={{ marginTop: 0, marginBottom: '4px', color: '#f9fafb' }}>Booking for: {show.name}</h2>
            <p style={{ margin: '4px 0', color: '#9ca3af' }}>Theatre: {show.theatre_name}</p>
            <p style={{ margin: '4px 0', color: '#9ca3af' }}>Start Time: {new Date(show.start_time).toLocaleString()}</p>

            <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: isSoldOut ? 'red' : 'green' }}>
                Seats Remaining: {show.total_seats}
            </p>

            {/* Seat selection map */}
            <div style={{ marginTop: '18px', marginBottom: '10px' }}>
                <h3 style={{ color: '#e5e7eb', marginTop: 0, marginBottom: '8px' }}>Select Your Seats</h3>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '10px' }}>Tap on the green seats to select. Grey seats are already booked.</p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '80%', height: '6px', borderRadius: '999px', background: 'linear-gradient(90deg,#4b5563,#9ca3af,#4b5563)', marginBottom: '8px' }} />
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '14px', letterSpacing: '0.08em' }}>SCREEN THIS SIDE</p>

                <div className="seat-grid">
                    {rows.map(row => (
                        Array.from({ length: seatsPerRow }, (_, i) => {
                            const seatNumber = i + 1;
                            const idLabel = `${row}${seatNumber}`;
                            const isBooked = bookedSeats.has(idLabel);
                            const isSelected = selectedSeats.includes(idLabel);
                            const baseClass = isBooked ? 'seat seat-booked' : isSelected ? 'seat seat-selected' : 'seat seat-available';

                            const handleClick = () => {
                                if (isBooked) return;
                                setSelectedSeats(prev => {
                                    const exists = prev.includes(idLabel);
                                    const next = exists ? prev.filter(s => s !== idLabel) : [...prev, idLabel];
                                    setSeatCount(next.length);
                                    return next;
                                });
                            };

                            return (
                                <button
                                    type="button"
                                    key={idLabel}
                                    className={baseClass}
                                    onClick={handleClick}
                                >
                                    {seatNumber}
                                </button>
                            );
                        })
                    ))}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: '#9ca3af' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="seat seat-available" style={{ width: 18, height: 18 }} /> Available
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="seat seat-selected" style={{ width: 18, height: 18 }} /> Selected
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="seat seat-booked" style={{ width: 18, height: 18 }} /> Booked
                    </div>
                </div>
            </div>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '16px' }}>

                <h3 style={{ borderBottom: '1px dashed #4b5563', paddingBottom: '10px', color: '#e5e7eb', marginTop: 0 }}>Your Contact Details</h3>

                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Full Name" required />
                <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="Phone Number (e.g., 9876543210)" required />
                {/* NEW INPUT FIELD: SEAT COUNT */}
                <div>
                    <label style={{ color: '#aaa', fontSize: '0.9em', display: 'block', marginBottom: '5px' }}>Number of Seats</label>
                    <input 
                        type="number" 
                        value={seatCount} 
                        onChange={(e) => setSeatCount(parseInt(e.target.value) || 1)}
                        min="1"
                        max={show.total_seats} // Max is available seats
                        required 
                    />
                </div>

                <div style={{ margin: '10px 0', padding: '15px', border: '1px solid #f97316', borderRadius: '8px', background: 'rgba(15,23,42,0.7)' }}>
                    <p style={{ margin: 0, color: '#f9fafb' }}>Booking {seatCount} Seat(s) for **₹{seatCount * 150}** (Mock Total)</p>

                </div>

                <button type="submit" disabled={isBooking || isSoldOut} className={isSoldOut ? 'btn-disabled' : 'btn-primary'} style={{ padding: '12px' }}>
                    {isBooking ? 'Processing...' : isSoldOut ? 'Sold Out' : `Confirm Booking (${seatCount} Seats)`}
                </button>
            </form>
            
            {bookingMessage && <p style={{ marginTop: '15px', padding: '10px', border: '1px dashed #4b5563', borderRadius: '6px', background: 'rgba(15,23,42,0.7)' }}>{bookingMessage}</p>}

        </div>
    );
};

export default BookingPage;
export {};