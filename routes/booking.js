const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

router.post('/booking', bookingController.postbooking);
router.get('/booking/:id', bookingController.getbookingID);
router.get('/booking/account/:id', bookingController.getBookingByAcccountID);
router.get('/booking/email/:email',bookingController.getBookingByEmail);
router.get('/booking/phonenumber/:phonenumber',bookingController.getBookingByPhoneNumber);
module.exports = router;