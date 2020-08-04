const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Booking = new Schema({
     id: {
        type: String
    },
    price: {
        type: Number
    },
    seats: {
        type:Array
    },
    routId: {
        type:String
    },
    customerId: {
        type:String
    },
    providerId: {
        type:String
    },
    timing: {
        type:String
    },date: {
        type:String
    },
    expire: {
        type:Boolean,
        default:false
    }
});

Booking.plugin(mongoosePaginate);

module.exports = mongoose.model("Bookings", Booking);