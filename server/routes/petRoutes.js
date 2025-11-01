// routes/petRoutes.js

const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/', petController.createPet);
router.get('/owner/:ownerID', petController.getPetsByOwner);
router.put('/:petID', petController.updatePet); 
router.delete('/:petID', petController.deletePet);

module.exports = router;