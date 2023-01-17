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
    profile : {
        type : String,
        default : "https://res.cloudinary.com/dhdvtnehi/image/upload/v1673858405/userProfile_mxee1j.png"
    }
},{timestamps: true})

module.exports = model('user',user)
