
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');
const app = express();

const MONGODB_URI = "mongodb+srv://Akhilesh:unplugged@cluster0.5efoz.mongodb.net/MakeMyTrip?retryWrites=true&w=majority";
const bookingRoutes = require('./routes/booking');

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'public')));

console.log("server up");

app.use(bookingRoutes);

mongoose
.connect(MONGODB_URI)
.then(result => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});