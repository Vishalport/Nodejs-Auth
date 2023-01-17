const {Schema,model, SchemaTypeOptions} = require('mongoose')

const userProfile = new Schema({
    firstName : {
        type : String,
    },
    lastName : {
        type : String
    },
    email:{
        type:String
    },
    dateOfBirth: {
        type : String
    },
    mobile:{
        type:Number
    },
    status : {
        type : String,
        default : "Active"
    },
    Domain : {
        type : String
    },
    Secction:{
        type:String
    },
    Lebel:{
        type:Number
    },
},{timestamps: true})

module.exports = model('userProfile',userProfile)
