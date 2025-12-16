const express = require('express');
const router = express.Router();
const adminOwnerController = require('../controllers/adminOwnerController');

// admin: get all owners
router.get('/', adminOwnerController.getAllOwners);

// admin: delete owner by id
router.delete('/:id', adminOwnerController.deleteOwner);

module.exports = router;
