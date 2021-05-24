const Booking = require('../models/booking');
exports.getbooking = (req, res, next) => {
    res.render('booking', {
        pageTitle: 'MMT Passenger Information!',
        path: '/booking'
    })
}

exports.postbooking = (req, res, next) => {
  

    const booking = new Booking({
    
        //fetch from the body and save in booking
 
    })
    booking.save()
        .then(result =>{
            console.log('booking added!');
            console.log(booking);
            res.redirect('/booking');
        })
        .catch(err => {
            console.log(err);
        })
}