const booking = require('../models/booking');
const Booking = require('../models/booking');
const User = require('../models/user');
var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');


exports.postbooking = (req, res, next) => {
    let flag = 0;
   const userEmailID = req.body.userEmailID;
   const travellers = [req.body.traveller1, req.body.traveller2,req.body.traveller3,req.body.traveller4,req.body.traveller5,req.body.traveller6,req.body.traveller7,req.body.traveller8];
   travellers.forEach(traveller => {
       if(traveller == userEmailID){
           flag = 1;
       }
   })
   if(flag==1){
    res.send("book again; Traveller's email can't be same as Booker's email ");
   }else{
    User.find({userEmailID: userEmailID}).then(user => {
        if(!user[0]){
            res.send("No such user email registered");
        }
        else{
    
        const booking = new Booking({
            
            userEmailID: userEmailID,
            travellersEmailID: travellers
        })
        booking.save()
            .then(result =>{
                console.log('booking added!');
                console.log(booking);
                User.find({userEmailID: booking.userEmailID}).then(user => {
                    redis.del(user[0].phoneNumber, function(err, response) {
                        if (response == 1) {
                           console.log("Redis Cache for user phoneNumber deleted!")
                        } else{
                         console.log("No Redis Cache for user phoneNumber Stored")
                        }
                     })
                     redis.del(booking.userEmailID, function(err, response) {
                        if (response == 1) {
                           console.log("Redis Cache for booking's userEmailID deleted!")
                        } else{
                         console.log("No Redis Cache for booking's userEmailID Stored")
                        }
                     })
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
        });
   }
   
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
            redis.setex(bookingID, 600, JSON.stringify({bookingID: booking._id,
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
            redis.setex(accountID, 30, JSON.stringify(bookingWithUuid), function () {
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
        console.log("redis hit");
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
        redis.setex(email, 600, JSON.stringify(arr), function () {
        res.send(arr);
    });
    }
});

}

exports.getBookingByPhoneNumber = async (req,res,next) => {

    const phoneNumber = req.params.phonenumber;
    let arr = [];
    redis.get(phoneNumber, async (err, result) => {
        if (err) throw err;
    
        if (result) {
            console.log("redis hit")
            res.send(JSON.parse(result));
        }
        else {
    
    let user = await User.find({ phoneNumber : phoneNumber });
    //console.log(user);
    let email = user[0].userEmailID;
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
                //console.log(email);
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
        redis.setex(phoneNumber, 600, JSON.stringify(arr), function () {
            res.send(arr);
        });
        }
    });

}