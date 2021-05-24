const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

router.get('/booking', bookingController.getbooking);

router.post('/booking', bookingController.postbooking);

module.exports = router;