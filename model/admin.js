const {Schema,model, SchemaTypeOptions} = require('mongoose')

const admin = new Schema({
    name : {
        type : String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
},{timestamps: true})

module.exports = model('admin',admin)
