const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
 Register a new admin user
 This route should NOT be exposed publicly in a real system.
 Admin accounts are normally pre-seeded in the database.
*/
exports.register = async (req, res) => {
    const { username, password, full_name, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const sql = `
            INSERT INTO admins (username, password, full_name, role)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            username,
            hashedPassword,
            full_name || null,
            role || 'admin'
        ]);

        res.status(201).json({
            message: "Admin user created successfully",
            adminID: result.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: "Username already exists."
            });
        }

        res.status(500).json({
            message: "Error registering admin user",
            error: error.message
        });
    }
};

/*
 Login for admin user
*/
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    try {
        const sql = `
            SELECT *
            FROM admins
            WHERE username = ?
        `;

        const [rows] = await db.query(sql, [username]);

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        const admin = rows[0];

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            {
                adminID: admin.adminID,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: "Login successful",
            adminID: admin.adminID,
            name: admin.full_name,
            role: admin.role,
            token
        });

    } catch (error) {
        console.error("Admin login error:", error);

        res.status(500).json({
            message: "Server error during login",
            error: error.message
        });
    }
};
