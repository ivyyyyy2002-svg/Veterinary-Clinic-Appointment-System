const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

// Import all the new and updated route handlers
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes = require('./routes/petRoutes');
const staffRoutes = require('./routes/staffRoutes'); // Assuming you create this for /api/staff
const diseaseRoutes = require('./routes/diseaseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
//const adminRoutes = require('./routes/staffRoutes'); // Assuming you create this for /api/admin/login

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json());

// API Routes - Mapped to match the documentation
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/appointments', appointmentRoutes);
//app.use('/api/admin', adminRoutes);

//test connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW() AS current_time');
        res.json({
            message: 'Database connection works!',
            time: rows[0].current_time
        });
    } catch (err) {
        console.error('Database test failed:', err.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Root endpoint for health check
app.get('/', (req, res) => {
    res.send('Veterinary Clinic API is operational and updated.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});