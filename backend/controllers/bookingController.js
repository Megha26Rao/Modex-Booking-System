// /backend/controllers/bookingController.js - Finalized for Concurrency, Multi-Seat, & User Data
const pool = require('../app');

async function listAvailableShows(req, res) {
    try {
        const result = await pool.query('SELECT * FROM shows WHERE total_seats > 0 ORDER BY start_time ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error listing available shows:', error.message);
        res.status(500).json({ message: 'Failed to retrieve available shows.' });
    }
}

async function listUserBookings(req, res) {
    const { userId } = req.params; 
    
    // IMPORTANT: The frontend sends the user name, which must be decoded
    const decodedUserId = decodeURIComponent(userId);

    try {
        const query = `
            SELECT * FROM bookings 
            WHERE user_id LIKE $1 
            ORDER BY created_at DESC;
        `;
        // We use a LIKE pattern match to find bookings by Name (since Phone is often omitted in the search key)
        const result = await pool.query(query, [`Name: ${decodedUserId}%`]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching user bookings:', error.message);
        res.status(500).json({ message: 'Failed to retrieve user bookings.' });
    }
}

async function listAllBookingsAdmin(req, res) {
    try {
        const query = `
            SELECT 
                b.id, 
                s.name AS show_name, 
                s.theatre_name,
                b.user_id, 
                b.seat_count, 
                b.status, 
                b.created_at
            FROM bookings b
            JOIN shows s ON b.show_id = s.id
            ORDER BY b.created_at DESC;
        `;
        const result = await pool.query(query);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching all bookings for Admin:', error.message);
        res.status(500).json({ message: 'Failed to retrieve all booking records.' });
    }
}


async function createBooking(req, res) {
    const { showId, userName, userPhone, seatCount } = req.body; 
    const bookingCount = parseInt(seatCount); 
    
    if (isNaN(bookingCount) || bookingCount <= 0) {
        return res.status(400).json({ message: 'Invalid number of seats requested.' });
    }

    // CRITICAL: The composite key used for user lookup
    const compositeUserId = `Name: ${userName} | Phone: ${userPhone}`; 

    const client = await pool.connect(); 

    try {
        await client.query('BEGIN'); // START TRANSACTION

        // PESSIMISTIC LOCKING
        const showResult = await client.query(
            `SELECT total_seats, name FROM shows WHERE id = $1 FOR UPDATE`,
            [showId]
        );

        if (showResult.rows.length === 0) { throw new Error('Show not found.'); }
        const currentAvailableSeats = showResult.rows[0].total_seats;

        // Check for overbooking
        if (currentAvailableSeats < bookingCount) { 
            throw new Error(`Booking Failed: Only ${currentAvailableSeats} seats remaining. Requested: ${bookingCount}.`); 
        }

        // Update the available seat count
        const newSeatCount = currentAvailableSeats - bookingCount;
        await client.query(
            'UPDATE shows SET total_seats = $1 WHERE id = $2',
            [newSeatCount, showId]
        );

        // Record the successful booking
        const bookingQuery = `
            INSERT INTO bookings (show_id, user_id, seat_count, status)
            VALUES ($1, $2, $3, 'CONFIRMED') 
            RETURNING id, status, created_at
        `;
        const bookingResult = await client.query(bookingQuery, [
            showId,
            compositeUserId, 
            bookingCount, 
        ]);

        await client.query('COMMIT'); 

        res.status(201).json({
            message: `Booking of ${bookingCount} seats confirmed successfully!`,
            booking: bookingResult.rows[0],
            seats_remaining: newSeatCount,
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Booking failed and transaction rolled back:', error.message);
        const statusCode = error.message.includes('Booking Failed') ? 409 : 500;
        res.status(statusCode).json({
            message: 'Booking Failed due to concurrency or unavailability: ' + error.message,
        });

    } finally {
        client.release();
    }
}

module.exports = {
    listAvailableShows,
    createBooking,
    listUserBookings,
    listAllBookingsAdmin,
};