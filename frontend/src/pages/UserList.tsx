// /frontend/src/pages/UserList.tsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShows } from '../context/ShowContext';
import { Show } from '../types/Show';

const UserListPage: React.FC = () => {
    const { shows } = useShows();
    // New states for Name and Location search inputs
    const [nameSearch, setNameSearch] = useState(''); 
    const [locationSearch, setLocationSearch] = useState(''); 
    
    // Renders a single show card (unchanged for aesthetics)
    const renderShowCard = (show: Show) => {
        const isSoldOut = show.total_seats <= 0;
        const buttonClass = isSoldOut ? 'btn-disabled' : 'btn-primary';
        
        // Mock Location data (since your DB doesn't store location explicitly)
        const mockLocation = show.name.length % 2 === 0 ? 'City Central Theatre' : 'Suburb Multiplex';

        return (
            <div key={show.id} className="show-card">
                <span style={{ fontSize: '0.8em', color: '#7f8c8d' }}>🎬 Show Time at {mockLocation}</span>
                
                <h3 style={{marginTop: '5px', color: '#f39c12'}}>{show.name}</h3>
                
                <div style={{ margin: '10px 0', borderTop: '1px dashed #444', paddingTop: '10px' }}>
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                        🕒 Screening Time: {new Date(show.start_time).toLocaleString()}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '0.9em', color: isSoldOut ? 'red' : '#2ecc71' }}>
                        🍿 Seats Remaining: {show.total_seats}
                    </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <Link 
                        to={`/booking/${show.id}`} 
                        className={`primary-link ${buttonClass}`}
                        style={{ pointerEvents: isSoldOut ? 'none' : 'auto', padding: '10px 25px' }}
                    >
                        {isSoldOut ? 'Sold Out' : 'Book Tickets'}
                    </Link>
                </div>
            </div>
        );
    };

    // CRITICAL FIX: Filter shows based on BOTH nameSearch and locationSearch
    const filteredShows = useMemo(() => {
        const nameQuery = nameSearch.toLowerCase();
        const locationQuery = locationSearch.toLowerCase();

        return shows.filter(show => {
            const showName = show.name.toLowerCase();
            // Use mock location data for filtering
            const showLocation = (show.name.length % 2 === 0 ? 'City Central Theatre' : 'Suburb Multiplex').toLowerCase();

            const nameMatch = showName.includes(nameQuery);
            const locationMatch = showLocation.includes(locationQuery);

            return nameMatch && locationMatch;
        });
    }, [shows, nameSearch, locationSearch]);


    return (
        <div>
            {/* The prominent search/header area */}
            <div style={{ 
                background: 'radial-gradient(circle at top left, #1f2937, #020617)',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                marginBottom: '40px',
                border: '1px solid #374151'
            }}>
                <h2 style={{ color: '#f9fafb', marginBottom: '15px' }}>Book Your Show Now</h2>
                
                {/* Search Bar Input - BOTH FUNCTIONAL */}
                <div style={{ 
                    display: 'flex',
                    gap: '15px',
                    padding: '15px',
                    borderRadius: '999px',
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid #f97316'
                }}>
                    
                    {/* Input 1: Search by Movie Name */}
                    <input 
                        type="text" 
                        placeholder="Search Movie Name..." 
                        style={{ flex: 1, border: 'none', background: 'transparent', color: '#e5e7eb' }} 

                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                    />
                    
                    {/* Input 2: Search by Location/Theatre */}
                    <input 
                        type="text" 
                        placeholder="Location/Theatre" 
                        style={{ flex: 1, border: 'none', background: 'transparent', color: '#e5e7eb' }} 

                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                    />
                    
                    <button className="btn-primary" style={{ width: '150px' }}>SEARCH</button>
                </div>
            </div>
            
            <h3>Now Showing: Available Movie Times ({filteredShows.length} listings)</h3>
            
            {/* Display filtered shows in a responsive grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px'}}>
                {filteredShows.length === 0 ? (
                    <p style={{ fontWeight: 'bold', color: '#555' }}>
                        {nameSearch || locationSearch ? `No results found for "${nameSearch}" at "${locationSearch}".` : 'No movies are currently scheduled. Use Admin View to create one.'}
                    </p>
                ) : (
                    filteredShows.map(s => renderShowCard(s))
                )}
            </div>
        </div>
    );
};

export default UserListPage;
export {};