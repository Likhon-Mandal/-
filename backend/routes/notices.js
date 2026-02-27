const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public: Read
router.get('/', noticeController.getNotices);

// Protected: Write (admin/superadmin only)
router.post('/', authenticate, requireAdmin, noticeController.addNotice);
router.put('/:id', authenticate, requireAdmin, noticeController.updateNotice);
router.delete('/:id', authenticate, requireAdmin, noticeController.deleteNotice);

module.exports = router;
