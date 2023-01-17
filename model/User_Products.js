const {Schema,model, SchemaTypeOptions} = require('mongoose')

const user_Products = new Schema({
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
        required : [true, " Manufacture Date is required...!!"]
    },
    Expiry_Date : {
        type:String,
        required : [true, " Dxpiry Date is required...!!"]
    }
},{timestamps: true});

module.exports = model('user_Products',user_Products)
