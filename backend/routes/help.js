const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');

router.get('/', helpController.getHelpRequests);
router.post('/', helpController.addHelpRequest);
router.put('/:id', helpController.updateHelpRequest);
router.delete('/:id', helpController.deleteHelpRequest);

module.exports = router;
