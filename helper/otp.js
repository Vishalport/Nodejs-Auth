require("../model/user");
module.exports = {

    generateOtp: () => {
        let otp = Math.ceil(1000 + Math.random() * 9000);
        return otp;
    },


    
    success:()=>{
            return({
                responseMessage: "Success...!!",
                responseCode: 200,
            });
    },
    Created:()=>{
        return({
            responseMessage: "Created...!!",
            responseCode: 200,
        });
    },
    Accepted:()=>{
        return({
            responseMessage: "Non-Authoritative Information...!!...!!",
            responseCode: 200,
        });
    },
}
