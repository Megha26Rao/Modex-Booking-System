// /frontend/src/pages/Admin.tsx - Finalized with Theatre Name and Link
import React, { useState } from 'react';
import { useShows } from '../context/ShowContext';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
    const { createShow } = useShows();
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [totalSeats, setTotalSeats] = useState(0);
    const [theatreName, setTheatreName] = useState(''); // New State
    const [message, setMessage] = useState<React.ReactNode>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Processing request...');
        
        // Validation update
        if (!name || !startTime || totalSeats <= 0 || !theatreName) {
            setMessage(<span style={{ color: 'yellow' }}>Error: All fields are required.</span>);
            return;
        }

        const data = { name, startTime, totalSeats, theatreName };
        const success = await createShow(data);

        if (success) {
            setMessage(<span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✅ Success! Show "{name}" created at {theatreName}.</span>);
            setName('');
            setStartTime('');
            setTotalSeats(0);
            setTheatreName('');
        } else {
            setMessage(<span style={{ color: '#e74c3c', fontWeight: 'bold' }}>❌ Creation Failed. Check the backend server logs for the database error.</span>);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ color: '#fbbf24', marginBottom: '8px' }}>Admin Control Panel</h2>
            
            {/* LINK TO BOOKING RECORDS */}
            <div style={{ marginBottom: '25px' }}>
                <Link to="/admin/bookings" style={{ textDecoration: 'none',fontSize: 20,fontWeight:3, color:'whitesmoke'}}>
                    View All Booking Records
                </Link>
            </div>
            
            <div style={{
                background: 'radial-gradient(circle at top left, #1f2937, #020617)',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                maxWidth: '640px',
                border: '1px solid #374151',
            }}>
                <h3 style={{ color: '#e5e7eb', borderBottom: '1px solid #4b5563', paddingBottom: '10px', marginTop: 0 }}>Create New Screening</h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Movie Title */}
                    <div>
                        <label style={{ color: '#aaa', fontSize: '0.9em', display: 'block', marginBottom: '5px' }}>Movie Title / Show Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., The Midnight Screening" required />
                    </div>
                    
                    {/* Theatre Name/Location */}
                    <div>
                        <label style={{ color: '#aaa', fontSize: '0.9em', display: 'block', marginBottom: '5px' }}>Theatre Name/Location</label>
                        <input type="text" value={theatreName} onChange={(e) => setTheatreName(e.target.value)} placeholder="e.g., Grand Cinema Hall 1" required />
                    </div>

                    {/* Start Time */}
                    <div>
                        <label style={{ color: '#aaa', fontSize: '0.9em', display: 'block', marginBottom: '5px' }}>Screening Start Time</label>
                        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    </div>
                    
                    {/* Total Seats */}
                    <div>
                        <label style={{ color: '#aaa', fontSize: '0.9em', display: 'block', marginBottom: '5px' }}>Total Seating Capacity</label>
                        <input type="number" value={totalSeats} onChange={(e) => setTotalSeats(parseInt(e.target.value))} placeholder="Total Seats (e.g., 50)" required min="1" />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
                        Schedule Show
                    </button>
                </form>
                
                {message && <p style={{ marginTop: '25px', padding: '15px', background: '#3a3a3a', borderRadius: '5px' }}>{message}</p>}
            </div>
        </div>
    );
};

export default AdminPage;
export {};