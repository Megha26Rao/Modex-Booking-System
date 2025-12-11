// /backend/app.js

// --- 1. Import necessary modules ---
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); 

// --- 2. Initialize Express App ---
const app = express();
const port = process.env.PORT || 3000;

// --- 3. Middleware Setup ---
app.use(cors()); 
app.use(express.json()); 

// --- 4. Database Connection Pool Setup ---
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// --- 5. Export the Pool for Controllers (CRITICAL FIX: MOVED UP) ---
// This ensures controllers get the pool object immediately, even during the circular load.
module.exports = pool;

// --- 6. Test DB Connection (Run after export) ---
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client. Check .env credentials and Postgres service status.', err.stack);
    // Exit if DB fails, but the server is still defined below for safety.
    process.exit(1); 
  }
  console.log('Successfully connected to PostgreSQL!');
  release(); 
});

// --- 7. Import and Use Routes (MOVED DOWN) ---
// The routes are now imported AFTER the pool is exported.
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 

// --- 8. Simple Default Route ---
app.get('/', (req, res) => {
  res.send('Modex Booking API is running! Access the API via /api/... endpoints.');
});

// --- 9. Start the Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); 
});

// We don't need to export here again since it was done in Step 5.
// (You can leave this line out, or just ensure the file ends here).