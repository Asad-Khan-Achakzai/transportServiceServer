const bookingsController = {};
const bookings = require('../models/booking.model');
const path = require('path');
const bcrypt = require('bcryptjs');
var shortid = require('shortid');

bookingsController.registerBooking = async (req, res) => {

    try {
      const body = req.body;
  
      // there must be a password in body
  
      // we follow these 2 steps
  console.log("server body = "+body);
    //   const password = body.password;
  
    //   var salt = bcrypt.genSaltSync(10);
    //   var hash = bcrypt.hashSync(password, salt);
  
    //   body.password = hash;
    //   for(let i = 0;i<body.servicesArray.length;i++){
    //   body.servicesArray[i].id = shortid.generate();
    // }
    body.id = shortid.generate();
      const booking = new bookings(body);
  
      const result = await booking.save();
      console.log('saved = ',booking);
      res.send({
              
        message: 'Signup successful'
      });
    } catch (ex) {
      console.log('ex', ex);
      if(ex.code===11000){
        res
        .send({
          message: 'This email has been registered already',
        })
        .status(500);
      }
      else {
      res
        .send({
          message: 'Error',
          detail: ex
        })
        .status(500);
    }
    }
  };
  module.exports = bookingsController;