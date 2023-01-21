const {Schema,model, SchemaTypeOptions} = require('mongoose')

const Products_store = new Schema({
    venderID : {
        type : String,
        required : [true, " vender-ID is required...!!"] 
    },
    Name : {
        type : String,
        require : [true, " Name is required...!!"]
    },
    vender_Email : {
        type : String,
        required : [true, " Vender Email is required...!!"]
    },
    city : {
        type : String,
        required : [true, "Address is required...!!"]
    },
    pin:{
        type:String,
        required : [true, " pin code is required...!!"]
    },
    location: {
        type: {
          type: String,
          default: "Point"
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
    },

},{timestamps: true});
Products_store.index({location:"2dsphere"})

module.exports = model('Products_store',Products_store)
