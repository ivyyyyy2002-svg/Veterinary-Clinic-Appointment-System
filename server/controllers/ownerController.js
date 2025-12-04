const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/owners/register
// FIXED: Now includes all address fields.
exports.register = async (req, res) => {
    // 1. Destructure all fields from the request body, including the address
    const { name, email, phoneNumber, password, address, city, province, postalCode } = req.body;

    // The core validation remains the same
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const sql = 'INSERT INTO Owners (name, email, phoneNumber, password, address, city, province, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, email, phoneNumber, hashedPassword, address, city, province, postalCode]);
    res.status(201).json({ message: "Owner registered successfully!", ownerID: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Email already in use." });
        }
        res.status(500).json({ message: "Error registering owner", error: error.message });
    }
};

// POST /api/owners/login
// This function does not need changes.
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    try {
    const [rows] = await db.query('SELECT * FROM Owners WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const owner = rows[0];
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
    const token = jwt.sign({ id: owner.ownerID, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ message: "Login successful", token, ownerID: owner.ownerID, name: owner.name });
    } catch (error)
    {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};

// GET /api/owners/:id
// UPDATED: Added province to the SELECT statement for completeness.
exports.getOwnerById = async (req, res) => {
    try {
        const { id } = req.params;
    const [owner] = await db.query('SELECT ownerID, name, email, phoneNumber, address, city, province, postalCode FROM Owners WHERE ownerID = ?', [id]);
    if (owner.length === 0) return res.status(404).json({ message: "Owner not found" });
    res.status(200).json(owner[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching owner", error: error.message });
    }
};

// PUT /api/owners/:id
// FIXED: Now allows updating of all address fields.
exports.updateOwner = async (req, res) => {
    const { id } = req.params;
    // 1. Destructure all fields that can be updated from the request body
    const { name, email, phoneNumber, address, city, province, postalCode } = req.body;
    try {
        // 2. Update the SQL query to include all the new columns in the SET clause
    const sql = 'UPDATE Owners SET name = ?, email = ?, phoneNumber = ?, address = ?, city = ?, province = ?, postalCode = ? WHERE ownerID = ?';
    const [result] = await db.query(sql, [name, email, phoneNumber, address, city, province, postalCode, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Owner not found" });
    res.status(200).json({ message: "Owner profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating owner", error: error.message });
    }
};