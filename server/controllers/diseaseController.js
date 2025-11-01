const db = require('../config/db');

// GET /api/diseases
exports.getAllDiseases = async (req, res) => {
    try {
    const [diseases] = await db.query('SELECT * FROM Diseases ORDER BY diseaseName');
        res.status(200).json(diseases);
    } catch (error) {
        res.status(500).json({ message: "Error fetching diseases", error: error.message });
    }
};