const db = require('../config/db');

// POST /api/appointments
exports.createAppointment = async (req, res) => {
    const { ownerID, petID, staffID, diseaseID, appointmentDate, appointmentTime, notes } = req.body;

    if (!ownerID || !petID || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: "Owner, pet, date, and time are required." });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const sql = `
            INSERT INTO Appointments 
            (ownerID, petID, staffID, diseaseID, appointmentDate, appointmentTime, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, 'Booked', ?)
        `;

        const [result] = await connection.query(sql, [
            ownerID,
            petID,
            staffID || null,
            diseaseID || null,
            appointmentDate,
            appointmentTime,
            notes || null
        ]);

        const appointmentID = result.insertId;

        await connection.commit();

        res.status(201).json({
            message: "Appointment created successfully!",
            appointmentID
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Appointment insert error:", error);  
        res.status(500).json({ message: "Failed to create appointment", error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// GET /api/appointments/owner/:ownerID
exports.getAppointmentsByOwner = async (req, res) => {
    const { ownerID } = req.params;

    try {
        const sql = `
            SELECT 
                a.*, 
                p.name AS pet_name, 
                s.name AS staff_name,
                d.diseaseName AS disease_name,
                d.category AS disease_category
            FROM Appointments a
            JOIN Pets p ON a.petID = p.petID
            JOIN Owners o ON p.ownerID = o.ownerID
            LEFT JOIN Staff s ON a.staffID = s.staffID
            LEFT JOIN Diseases d ON a.diseaseID = d.diseaseID
            WHERE o.ownerID = ?
            ORDER BY a.appointmentDate DESC, a.appointmentTime DESC
        `;

        const [appointments] = await db.query(sql, [ownerID]);

        res.status(200).json(appointments);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching appointments",
            error: error.message
        });
    }
};


// DELETE /api/appointments/:appointmentID
exports.deleteAppointment = async (req, res) => {
    const { appointmentID } = req.params;

    try {
        const sql = `
            UPDATE Appointments 
            SET status = 'Cancelled'
            WHERE appointmentID = ?
        `;

        const [result] = await db.query(sql, [appointmentID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json({ message: "Appointment cancelled successfully." });

    } catch (error) {
        res.status(500).json({
            message: "Error cancelling appointment",
            error: error.message
        });
    }
};
