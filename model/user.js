const {Schema,model, SchemaTypeOptions} = require('mongoose')

const user = new Schema({
    firstName : {
        type : String,
    },
    lastName : {
        type : String
    },
    username:{
        type:String
    },
    email:{
        type:String
    },
    dateOfBirth: {
        type : String
    },
    otp:{
        type:Number   
    },
    otpVerification : {
        type : Boolean,
        default : false
    },
    password:{
        type:String
    },
    mobile:{
        type:Number
    },
    otpTime : {
        type : String
    },
    status : {
        type : String,
        default : "Active"
    }
})

module.exports = model('user',user)
