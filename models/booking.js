const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userEmailID: {
        type: String,
    },
    travellersEmailID: [String],
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Booking', bookingSchema);