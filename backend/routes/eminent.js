const express = require('express');
const router = express.Router();
const eminentController = require('../controllers/eminentController');

// GET /api/eminent - Get all eminent figures grouped by category
router.get('/', eminentController.getEminentFigures);

// POST /api/eminent - Add a new eminent figure
router.post('/', eminentController.addEminentFigure);

// PUT /api/eminent/:id - Update an eminent figure's details
router.put('/:id', eminentController.updateEminentFigure);

// DELETE /api/eminent/:id - Remove an eminent figure
router.delete('/:id', eminentController.deleteEminentFigure);

module.exports = router;
