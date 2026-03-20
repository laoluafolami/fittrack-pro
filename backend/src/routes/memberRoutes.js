const express = require('express');
const router = express.Router();
const { getAllMembers, getMember, getExpiringMemberships } = require('../controllers/membersController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/',         protect, adminOnly, getAllMembers);
router.get('/expiring', protect, adminOnly, getExpiringMemberships);
router.get('/:id',      protect, getMember);
module.exports = router;