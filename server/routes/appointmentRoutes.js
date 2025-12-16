const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/', appointmentController.createAppointment);
router.get('/owner/:ownerID', appointmentController.getAppointmentsByOwner);
router.delete('/:appointmentID', appointmentController.deleteAppointment);
router.get('/', appointmentController.getAllAppointments);


module.exports = router;