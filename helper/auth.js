const jwt = require("jsonwebtoken");
jwtKey = "jwt";
require("../model/user")

module.exports ={

    // create_token:() => {
    //     let token = jwt.sign({jwtKey},jwtKey);
    //     return token;
    // },

    verifyToken : async(req,res,next) => {

        const token = req.body.token || req.query.token || req.headers["authorization"];
        if(!token){
            res.status(200).send({success:false, msg:"A token is required for authentication"});
        }
        try {
            const decode = jwt.verify(token,Config.secret_jwt);
            req.user = decode;
        } catch (error) {
            res.status(400).send("Invalid Token")
        }
        return next();
    }
}

// Jwt token


// const verifyToken = async(req,res,next) => {

//     const token = req.body.token || req.query.token || req.headers["authorization"];
//     if(!token){
//         res.status(200).send({success:false, msg:"A token is required for authentication"});
//     }
//     try {
//         const decode = jwt.verify(token,Config.secret_jwt);
//         req.user = decode;
//     } catch (error) {
//         res.status(400).send("Invalid Token")
//     }
//     return next();
// }

// module.exports = verifyToken;