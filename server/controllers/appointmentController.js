const db = require('../config/db');

// ... The createAppointment function with transactions from the previous answer remains the same ...
// POST /api/appointments
exports.createAppointment = async (req, res) => {
    const { ownerID, petID, staffID, diseaseID, appointmentDate, appointmentTime, status } = req.body;
    if (!ownerID || !petID || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: "Owner, pet, date, and time are required." });
    }
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const apptSQL = 'INSERT INTO Appointments (ownerID, petID, staffID, diseaseID, appointmentDate, appointmentTime, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [apptResult] = await connection.query(apptSQL, [ownerID, petID, staffID || null, diseaseID || null, appointmentDate, appointmentTime, status || 'Booked']);
        const newAppointmentId = apptResult.insertId;
        await connection.commit();
        res.status(201).json({ message: "Appointment created successfully!", appointmentID: newAppointmentId });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Failed to create appointment", error: error.message });
    } finally {
        if (connection) connection.release();
    }
};


// GET /api/appointments/owner/:ownerId
exports.getAppointmentsByOwner = async (req, res) => {
    const { ownerID } = req.params;
    try {
        const sql = `
            SELECT a.*, p.name as pet_name, s.name as staff_name
            FROM Appointments a
            JOIN Pets p ON a.petID = p.petID
            LEFT JOIN Staff s ON a.staffID = s.staffID
            WHERE a.ownerID = ?
            ORDER BY a.appointmentDate DESC`;
        const [appointments] = await db.query(sql, [ownerID]);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

// DELETE /api/appointments/:appointmentId
exports.deleteAppointment = async (req, res) => {
    const { appointmentID } = req.params;
    try {
        // Instead of deleting, we'll cancel it. This preserves the record.
        const [result] = await db.query("UPDATE Appointments SET status = 'Cancelled' WHERE appointmentID = ?", [appointmentID]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Appointment not found." });
        res.status(200).json({ message: "Appointment cancelled successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment", error: error.message });
    }
};