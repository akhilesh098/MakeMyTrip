const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

router.post('/booking', bookingController.postbooking);
router.get('/booking/:id', bookingController.getbookingID);

module.exports = router;