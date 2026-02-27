const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/recycle-bin', systemController.getRecycleBin);
router.put('/restore/:table/:id', systemController.restoreItem);

module.exports = router;
