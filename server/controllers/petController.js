// controllers/petController.js

const db = require('../config/db');

// POST /api/pets
// FIXED: Now correctly uses 'age' (INT) instead of 'date_of_birth' (DATE).
exports.createPet = async (req, res) => {
    // 1. Destructure 'age' from the request body.
    const { ownerID, name, type, breed, age, color, allergies, gender } = req.body;
    if (!ownerID || !name || !type) {
        return res.status(400).json({ error: "Owner ID, pet name, and type are required." });
    }
    try {
        const sql = 'INSERT INTO Pets (ownerID, name, type, breed, age, color, allergies, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [ownerID, name, type, breed, age, color, allergies, gender]);
        res.status(201).json({ message: "Pet created successfully", petID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error creating pet", error: error.message });
    }
};

// GET /api/pets/owner/:ownerId

exports.getPetsByOwner = async (req, res) => {
    const { ownerID } = req.params;
    try {
        const [pets] = await db.query('SELECT * FROM Pets WHERE ownerID = ?', [ownerID]);
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pets for owner", error: error.message });
    }
};

exports.updatePet = async (req, res) => {
    const { petID } = req.params;
    const { name, type, breed, age, color, allergies, gender } = req.body;
    try {
        const sql = 'UPDATE Pets SET name = ?, type = ?, breed = ?, age = ?, color = ?, allergies = ?, gender = ? WHERE petID = ?';
        const [result] = await db.query(sql, [name, type, breed, age, color, allergies, gender, petID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }
        res.status(200).json({ message: "Pet updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error updating pet.", error: error.message });
    }
};


// DELETE /api/pets/:petId

exports.deletePet = async (req, res) => {
    const { petID } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Pets WHERE petID = ?', [petID]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pet not found." });
        res.status(200).json({ message: "Pet deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pet", error: error.message });
    }
};