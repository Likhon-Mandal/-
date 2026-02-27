const express = require('express');
const router = express.Router();
const eminentController = require('../controllers/eminentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public: Read
router.get('/', eminentController.getEminentFigures);

// Protected: Write (admin/superadmin only)
router.post('/', authenticate, requireAdmin, eminentController.addEminentFigure);
router.put('/:id', authenticate, requireAdmin, eminentController.updateEminentFigure);
router.delete('/:id', authenticate, requireAdmin, eminentController.deleteEminentFigure);

module.exports = router;
