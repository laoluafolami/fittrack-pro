const express = require('express');
const router = express.Router();
const { getTodaysClasses, getAllClasses, bookClass,
        cancelBooking, getMyBookings } = require('../controllers/classesController');
const { protect } = require('../middleware/auth');
router.get('/',                  protect, getAllClasses);
router.get('/today',             protect, getTodaysClasses);
router.get('/mybookings',        protect, getMyBookings);
router.post('/book',             protect, bookClass);
router.put('/cancel/:bookingId', protect, cancelBooking);
module.exports = router;