require("../model/user")
module.exports ={

    generateOtp:()=>{
       let otp = Math.ceil(1000 + Math.random() * 9000);
       return otp;
    },
}
