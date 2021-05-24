const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    
    booker: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingID: {
        type: String,
        required: true
    },
    travellers: [
            {   travellersEmailIDs: {type: String}  }
    ],
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Booking', bookingSchema);