const booking = require('../models/booking');
const Booking = require('../models/booking');
const User = require('../models/user');
var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');

exports.postbooking = (req, res, next) => {
   const userEmailID = req.body.userEmailID;
   const travellers = [req.body.traveller1, req.body.traveller2];
   User.find({userEmailID: userEmailID}).then(user => {
    if(!user[0]){
        res.send("No such user email registered");
    }
    });
    const booking = new Booking({
        
        userEmailID: userEmailID,
        travellersEmailID: travellers
    })
    booking.save()
        .then(result =>{
            console.log('booking added!');
            console.log(booking);
            User.find({userEmailID: booking.userEmailID}).then(user => {
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

    redis.get(bookingID, function (err, reply) {
        if (err)  res.send(null);
        else if (reply){ //Book exists in cache
    	//console.log(reply);
    	console.log("Redis hit");
        res.send(JSON.parse(reply));
    }
        else {//console.log(bookingID,"came inside");
    Booking.findById(bookingID).then(booking=> {
            var uuid;
        User.find({userEmailID: booking.userEmailID}).then(user => {
            uuid=user[0]._id;
            redis.set(bookingID, JSON.stringify({bookingID: booking._id,
                uuid: uuid,
                userEmailID: booking.userEmailID,
                travellers: booking.travellersEmailID,
                dateAdded: booking.dateAdded
            }), function () {
            res.send({bookingID: booking._id,
                uuid: uuid,
                userEmailID: booking.userEmailID,
                travellers: booking.travellersEmailID,
                dateAdded: booking.dateAdded
            });
                    });
            
        });
        
    })
	}
	})
}

exports.getBookingByAcccountID = (req, res, next) => {
    const accountID = req.params.id;
    let bookingID;
    redis.get(accountID, function (err, reply) {
        if (err)  res.send(null);
        else if (reply){ //Book exists in cache
    	//console.log(reply);
    	console.log("Redis hit");
        res.send(JSON.parse(reply));
    }
        else {//console.log(bookingID,"came inside");
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
            redis.set(accountID, JSON.stringify(bookingWithUuid), function () {
            res.send(bookingWithUuid);
        });
        })
    })
}
})
}
exports.getBookingByEmail = async (req, res,next) => {
    const email = req.params.email;
    let arr = [];

redis.get(email, async (err, result) => {
    if (err) throw err;

    if (result) {
        console.log("resdis hit")
        res.send(JSON.parse(result));
    }
    else {
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
        redis.set(email, JSON.stringify(arr), function () {
        res.send(arr);
    });
    }
});

}