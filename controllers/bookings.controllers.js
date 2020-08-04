const bookingsController = {};
const bookings = require("../models/booking.model");
const serviceProvider = require('../models/serviceProviders.model');
const path = require("path");
const bcrypt = require("bcryptjs");
var shortid = require("shortid");
const mongoose = require('mongoose');

bookingsController.registerBooking = async (req, res) => {
  let bookingId;

  try {
    const body = req.body;

    // there must be a password in body

    // we follow these 2 steps
    // console.log("server body = "+body);
    //   const password = body.password;

    //   var salt = bcrypt.genSaltSync(10);
    //   var hash = bcrypt.hashSync(password, salt);

    //   body.password = hash;
    //   for(let i = 0;i<body.servicesArray.length;i++){
    //   body.servicesArray[i].id = shortid.generate();
    // }

    //if it is update than the price should be added not replaced and the id should be the old one for update
    let user = await bookings.findOne({
      customerId: body.customerId,
      routId: body.routId,
    });
    if (user) {
      body.price = body.price + user.price;
      body.id = user.id;
      bookingId = user.id;
    } else {
      body.id = shortid.generate();
      bookingId = body.id;
    }

    console.log("body = ", body);
    const filter = { customerId: body.customerId, routId: body.routId };
    const update = {
      $push: { seats: { $each: body.seats } },
      id: body.id,
      price: body.price,
      routId: body.routId,
      customerId: body.customerId,
      providerId: body.providerId,
      timing: body.timing,
      date: body.date,
      expire: "false",
    };

    const result = await bookings.updateOne(
      // { customerId: body.customerId },

      // { $push: { 'seats': {$each: body.seats}} },
      filter,
      update,
      { upsert: true } // Make this update into an upsert
    );
    //const booking = new bookings(body);
    console.log("result = ", result);
    //const result = await booking.save();
    //console.log('saved = ',booking);
    // res.send({

    //   message: 'Booking successful'
    // });
    if (result.nModified == 1) {
      res.status(200).send({
        code: 200,
        message: "Updated Successfully",
        id: bookingId,
      });
    } else if (result.upserted) {
      res.status(200).send({
        code: 200,
        message: "Created Successfully",
        id: bookingId,
      });
    } else {
      res.status(422).send({
        code: 422,
        message: "Unprocessible Entity",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
  //   console.log('ex', ex);
  //   if(ex.code===11000){
  //     res
  //     .send({
  //       message: 'This email has been registered already',
  //     })
  //     .status(500);
  //   }
  //   else {
  //   res
  //     .send({
  //       message: 'Error',
  //       detail: ex
  //     })
  //     .status(500);
  // }
  // }
};
bookingsController.expireBookings = async (req, res) => {
  console.log("bodi =", req.body);
 
  try{
    mongoose.set('useFindAndModify', false);
  const filter = { id: req.body.id };
  const update = { expire: true };
  let doc = await bookings.findOneAndUpdate(filter, update, {
    new: true,
  });
  const result =  serviceProvider.updateOne(
    { "servicesArray.id": doc.routId },
    
    { $pullAll: { 'servicesArray.$.bookedSeats':   doc.seats   }
   //  { $push: { 'servicesArray.$.bookedSeats': {$each:req.body.bookedSeats}}
   },function(err,success){
      if (result.nModified === 1) {
        res.status(200).send({
          code: 200,
          message: 'Updated Successfully'
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: 'Created Successfully'
        });
      } else {
        {
          res.status(200).send({
            code: 200,
            message: 'Task completed successfully'
          });
        }
      }
      if(err){
      console.log('error = ',err);
    }
    else
    console.log('success = ',success);
    }
    
);
  // res.status(200).send({
  //   code: 200,
  //   message: "updated Successfully",
  //   newobj: doc
  // });
}catch (error) {
  console.log("error", error);
  return res.status(500).send(error);
}
};
bookingsController.deleteBooking = async (req, res) => {
  if (!req.params._idd) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._idd;

    const result = await bookings.findOneAndDelete({
      id: _id,
    });

    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getBooking = async (req, res) => {
  let user;
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.params.id;
    //console.log('customer id = ',_id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ customerId: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getBookingObject = async (req, res) => {
  let user;
  console.log("id =", req.params._id);
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.params._id;
    //console.log('customer id = ',_id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ id: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getRouteBookings = async (req, res) => {
  let user;
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.params.id;
    console.log(" id = ", _id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ routId: _id });
    console.log("data = ", user);
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
module.exports = bookingsController;
