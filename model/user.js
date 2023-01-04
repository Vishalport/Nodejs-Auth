const {Schema,model} = require('mongoose')

const user = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    otp:{
        type:String  // shoud be a number 
    },
    password:{
        type:String
    },
    mobile:{
        type:Number
    },
    otpTime : {
        type : String
    }
})

module.exports = model('user',user)
