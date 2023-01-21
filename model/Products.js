const {Schema,model, SchemaTypeOptions} = require('mongoose')

const Products = new Schema({
    Product_type : {
        type : String,
        required : [true, " Product type is required...!!"]
    },
    Name : {
        type : String,
        require : [true, " Product Name is required...!!"]
    },
    Product_ID : {
        type : String,
        required : [true, " Product ID is required...!!"]
    },
    Product_qty : {
        type : String,
        required : [true, " Product Quantity is required...!!"]
    },
    Manufacture_Date:{
        type:String,
    },
    Expiry_Date : {
        type:String,
    },
    size : {
        type : String
    },
    price : {
        type : Number
    },

},{timestamps: true});

module.exports = model('Products',Products)
