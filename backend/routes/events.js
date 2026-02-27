const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public: Read
router.get('/', eventController.getEvents);

// Protected: Write (admin/superadmin only)
router.post('/', authenticate, requireAdmin, eventController.addEvent);
router.put('/:id', authenticate, requireAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, requireAdmin, eventController.deleteEvent);

module.exports = router;
