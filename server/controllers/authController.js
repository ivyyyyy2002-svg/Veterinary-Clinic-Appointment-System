const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new staff/admin user (should be protected in a real app)
exports.register = async (req, res) => {
    const { username, password, full_name, role } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 12); // Hash password with 12 salt rounds
        const sql = 'INSERT INTO administrators (username, password, full_name, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [username, hashedPassword, full_name, role || 'Staff']);
        res.status(201).json({ message: "User created successfully!", adminId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Username already exists." });
        }
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login for staff/admin
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    try {
        const [rows] = await db.query('SELECT * FROM administrators WHERE username = ? AND is_active = 1', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." }); // User not found
        }

        const user = rows[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials." }); // Wrong password
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.admin_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Token expires in 8 hours
        );

        res.status(200).json({ message: "Login successful", adminID: user.admin_id, name: user.full_name, role: user.role, token });
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};