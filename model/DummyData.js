const {Schema,model, SchemaTypeOptions} = require('mongoose')

const House = new Schema({
    ///  { "location" : "Delhi", "price": "10000",  "Booking" : true, "Folor" : 10, "Rooms" : "3", "Balcony" : 3},
    location : {
        type : String,
    },
    price : {
        type : String,
    },
    Booking : {
        type : String,
    },
    Folor : {
        type : Number,
    },
    Rooms:{
        type:String,
    },
    Balcony : {
        type:Number,
    }
});
module.exports = model('House',House)
