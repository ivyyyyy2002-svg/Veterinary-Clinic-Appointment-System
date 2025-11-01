const db = require('../config/db');

exports.getAllVets = async (req, res) => {
    try {
    const [staff] = await db.query('SELECT staffID, name, position, specialty, email, phoneNumber, status FROM Staff WHERE status = "Active"');
    res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching veterinarians", error: error.message });
    }
};