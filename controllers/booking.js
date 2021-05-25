const Booking = require('../models/booking');
const User = require('../models/user');

exports.postbooking = (req, res, next) => {
   const userEmailID = req.body.userEmailID;
   const travellers = [req.body.traveller1, req.body.traveller2];
   console.log(req.body);
   console.log(travellers);
  /* User.find(userEmailID =>{
       if(!userEmailID){
           res.redirect("/booking");
       }
   })*/
    const booking = new Booking({
        
        userEmailID: userEmailID,
        travellersEmailID: travellers
    })
    booking.save()
        .then(result =>{
            console.log('booking added!');
            console.log(booking);
            res.send(booking);
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getbookingID = (req, res, next) => {

    const bookingID = req.params.id;
    Booking.findById(bookingID).then(booking=> {
            var uuid;
        User.find({userEmailID: booking.userEmailID}).then(user => {
            uuid=user[0]._id;
            res.send({bookingID: booking._id,
                uuid: uuid,
                userEmailID: booking.userEmailID,
                travellers: booking.travellersEmailID,
                dateAdded: booking.dateAdded
            });
        });
        
        
        
    })
}