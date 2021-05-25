const booking = require('../models/booking');
const Booking = require('../models/booking');
const User = require('../models/user');

exports.postbooking = (req, res, next) => {
   const userEmailID = req.body.userEmailID;
   const travellers = [req.body.traveller1, req.body.traveller2];

    const booking = new Booking({
        
        userEmailID: userEmailID,
        travellersEmailID: travellers
    })
    booking.save()
        .then(result =>{
            console.log('booking added!');
            console.log(booking);
            User.find({userEmailID:booking.userEmailID}).then(user => {
                res.send({bookingID: booking._id,
                    uuid: user[0]._id,
                    userEmailID: booking.userEmailID,
                    travellers: booking.travellersEmailID,
                    dateAdded: booking.dateAdded
                });
            })
            
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
exports.getBookingByAcccountID = (req, res, next) => {
    const accountID = req.params.id;
    let bookingID;
    User.findById(accountID).then(user => {
        Booking.find({userEmailID: user.userEmailID}).then(booking => {
            var bookingWithUuid = [];

            booking.map(b => {
                //replacingID with booking_id
                const x = {
                    uuid : accountID,
                    bookingID : b. _id,
                    userEmailID : b.userEmailID,
                    travellers : b.travellersEmailID,
                    dateAdded : b.dateAdded,
                }

                bookingWithUuid.push(x);
            })

            res.send(bookingWithUuid);

            /*res.json(
                booking.map(b =>
                  `{ "uuid": "${accountID}","bookingID": "${b._id}", "userEmailID": "${b.userEmailID}","travellers" : "${b.travellersEmailID}","dateAdded" : "${b.dateAdded}"}
                  `
                ).join('')
              )*/
        })
    })
}
exports.getBookingByEmail = async (req, res,next) => {
    const email = req.params.email;
    let arr = [];


    let user = await User.find({ userEmailID : email });
    let bookings = await Booking.find({userEmailID: email});
    arr = bookings.map(b=> { 
                return {
                    uuid: user[0]._id,
                    bookingID : b. _id,
                    userEmailID : b.userEmailID,
                    travellers : b.travellersEmailID,
                    dateAdded : b.dateAdded
                	}
    			});
    
    bookings = await Booking.find({travellersEmailID: email});
    for(const b of bookings) {
    	const user = await User.find({userEmailID: b.userEmailID});
    	arr.push({
    		uuid: user[0]._id,
            bookingID : b._id,
            userEmailID : b.userEmailID,
            travellers : b.travellersEmailID,
            dateAdded : b.dateAdded
    	});
    }
   
   res.send(arr);
}