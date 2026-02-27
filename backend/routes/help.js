const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public: Read and submit help requests
router.get('/', helpController.getHelpRequests);
router.post('/', helpController.addHelpRequest);

// Protected: Admin management actions only
router.put('/:id', authenticate, requireAdmin, helpController.updateHelpRequest);
router.delete('/:id', authenticate, requireAdmin, helpController.deleteHelpRequest);

module.exports = router;
