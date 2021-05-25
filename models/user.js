const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    userEmailID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);