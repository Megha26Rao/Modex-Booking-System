// /backend/controllers/adminController.js - Finalized for Movie Show System
const pool = require('../app');

async function createShow(req, res) {
    // COLLECT NEW FIELD: theatreName
    const { name, startTime, totalSeats, theatreName } = req.body; 

    // Validation update: require all fields
    if (!name || !startTime || !totalSeats || totalSeats <= 0 || !theatreName) {
        return res.status(400).json({ message: 'Missing or invalid required fields for new screening (including Theatre Name).' });
    }

    try {
        // CRITICAL: Date fix remains
        const formattedStartTime = new Date(startTime).toISOString();
        
        const query = `
            INSERT INTO shows (name, start_time, total_seats, theatre_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await pool.query(query, [name, formattedStartTime, parseInt(totalSeats), theatreName]);

        res.status(201).json({
            message: `Screening for "${name}" created successfully at ${theatreName}.`, 
            show: result.rows[0],
        });
    } catch (error) {
        console.error('Error scheduling new screening (DB failed):', error.message); 
        res.status(500).json({ message: 'Failed to schedule new show time.' });
    }
}

async function listAllShows(req, res) {
    try {
        const result = await pool.query('SELECT * FROM shows ORDER BY start_time ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error listing shows:', error.message);
        res.status(500).json({ message: 'Failed to retrieve show list.' });
    }
}

module.exports = {
    createShow,
    listAllShows
};