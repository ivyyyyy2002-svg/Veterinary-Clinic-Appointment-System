const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

router.post('/register', ownerController.register);
router.post('/login', ownerController.login);
router.get('/:id', ownerController.getOwnerById);
router.put('/:id', ownerController.updateOwner);

module.exports = router;