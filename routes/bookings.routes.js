const express = require("express");
const cors = require('cors');
const app = express();
const router = express.Router();
//let app = require('express')();
let http = require('http').Server(express);
const bookingController = require('../controllers/bookings.controllers');
const checkAuth = require('../middleware/check-auth');

router.post("/registerBooking",bookingController.registerBooking);
module.exports = router;