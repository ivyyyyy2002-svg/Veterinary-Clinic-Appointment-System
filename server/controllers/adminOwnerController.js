const db = require('../config/db');

/*GET /api/admins/owners*/
/*Admin: view all owners*/
exports.getAllOwners = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ownerID, name, email, phoneNumber, city, province
            FROM Owners
            ORDER BY ownerID
        `);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch owners",
            error: error.message
        });
    }
};

/*DELETE /api/admins/owners/:id*/
/*Admin: delete an owner*/
exports.deleteOwner = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM Owners WHERE ownerID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.status(200).json({ message: "Owner deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete owner",
            error: error.message
        });
    }
};
