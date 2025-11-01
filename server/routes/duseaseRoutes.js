const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/', diseaseController.getAllDiseases);
// You can add POST, PUT, DELETE for admin later

module.exports = router;