const {Schema,model, SchemaTypeOptions} = require('mongoose')

const order = new Schema({
    Name : {
        type : String,
    },
    Product_ID : {
        type : String,
    },
    Product_qty : {
        type : Number,
    },
    price : {
        type : Number
    },

},{timestamps: true});

module.exports = model('order',order)
