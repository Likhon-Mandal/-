const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

// GET /api/committee - Get all committees with their members
router.get('/', committeeController.getCommittees);

// POST /api/committee - Create a new committee
router.post('/', committeeController.createCommittee);

// PUT /api/committee/:id - Update an existing committee
router.put('/:id', committeeController.updateCommittee);

// DELETE /api/committee/:id - Delete a committee
router.delete('/:id', committeeController.deleteCommittee);

module.exports = router;
