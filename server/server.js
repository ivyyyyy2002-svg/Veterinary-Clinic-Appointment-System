const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

// Import routes
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes = require('./routes/petRoutes');
// const staffRoutes = require('./routes/staffRoutes');
const authRoutes = require('./routes/authRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminOwnerRoutes = require('./routes/adminOwnerRoutes');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5050;

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Core Middleware
app.use(cors());
app.use(express.json());

const clientPath = path.join(__dirname, '../client'); 
console.log('Client directory path:', clientPath);

app.use(express.static(clientPath));

// API Routes
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);
// app.use('/api/staff', staffRoutes);
app.use('/api/admins', authRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admins/owners', adminOwnerRoutes);


app.get('/', (req, res) => {
  const homePath = path.join(clientPath, 'home.html');
  console.log('Serving home from:', homePath);
  res.sendFile(homePath);
});

app.get('/register', (req, res) => {
  const registerPath = path.join(clientPath, 'register.html');
  console.log('Serving register from:', registerPath);
  res.sendFile(registerPath);
});

app.get('/login', (req, res) => {
  const loginPath = path.join(clientPath, 'login.html');
  console.log('Serving login from:', loginPath);
  res.sendFile(loginPath);
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/diagnose', (req, res) => {
  const fs = require('fs');
  const clientPath = path.join(__dirname, '../client');
  
  try {
    const exists = fs.existsSync(clientPath);
    const files = exists ? fs.readdirSync(clientPath) : [];
    const indexExists = fs.existsSync(path.join(clientPath, 'home.html'));
    const registerExists = fs.existsSync(path.join(clientPath, 'register.html'));
    const loginExists = fs.existsSync(path.join(clientPath, 'login.html'));
    
    res.json({
      serverDirectory: __dirname,
      clientPath: clientPath,
      clientExists: exists,
      files: files,
      indexExists: indexExists,
      registerExists: registerExists,
      loginExists: loginExists
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      serverDirectory: __dirname,
      clientPath: clientPath
    });
  }
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Client path: ${path.join(__dirname, '../client')}`);
});