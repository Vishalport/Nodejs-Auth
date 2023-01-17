const {Schema,model, SchemaTypeOptions} = require('mongoose')

const userAuth = new Schema({
    username:{
        type:String
    },
    email:{
        type:String
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
    otpTime : {
        type : String
    },
},{timestamps: true})

module.exports = model('userAuth',userAuth);
