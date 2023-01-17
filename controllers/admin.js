const bcrypt = require("bcryptjs");
var adminModel = require('../model/admin');
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

 const create_token = (id) => {
    try {
        const token = jwt.sign({ _id: id }, config.key);
        return token;
    } catch (error) {
        return res.status(500).send({
            responseMessage: "Error While Creating the Token....!!",
            responseCode: 500,
        });
    }
}
module.exports = {
    // API Development...!!

    // adminSignup: async (request, responce) => {
    //     try {
    //         adminModel.findOne({ email: request.body.email }, async (err, result) => {
    //      if        (err) {
    //                 return await res.status(500).send({
    //                     responseMessage: "Internal server error",
    //                     responseCode: 500,
    //                     error: err,
    //                 });
    //             } else if (result) {
    //                 return await responce.status(401).send({
    //                     responseMessage: "admin already exists..!!",
    //                     responseCode: 401,
    //                 });
    //             } else {
    //                 request.body.password = await bcrypt.hash(request.body.password, 10);
    //                 adminModel(request.body).save( async(err1, res2) => {
    //                     if (err1) {
    //                         return await responce.status(500).send({
    //                             responseMessage: "Internal server error",
    //                             responseCode: 500,
    //                         });
    //                     } else {
    //                         console.log("Signup Success...!!");
    //                         return await responce.status(200).send({
    //                             responseMessage: "Signup Success...!!",
    //                             responseCode: 200,
    //                             responsResult:[res2]
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     } catch (error) {
    //         console.log("Something Went Woring..!");
    //         console.log(error);
    //         return await responce.status(400).send({
    //             responseMessage: "Something went Worng..!!",
    //             responseCode: 400
    //         });
    //     }
    // },

    adminLogin: async(request,responce) => {
        try {
            adminModel.findOne({ email: request.body.email }, async (err, result) => {
                if (err) {
                    return responce.status(500).send({
                        responseMessage: "Internal Server Error..!!",
                        responseCode: 500,
                    });
                } else if (result) {
                    try {
                        // const password = request.body.password;
                        // const check = await bcrypt.compare(password, result.password);
                        if (result.password == request.body.password) {
                            console.log("admin is Live..!!");
                            /* Jwt token...!! */
                            const tokenData = create_token(result);
                            responce.send(tokenData);
                        } else {
                            console.log("mail or Password IncorrecEt..!!");
                            return responce.status(501).send({
                                responseMessage: "Email or Password Does't match.....!!",
                                responseCode: 501,
                            });
                        }
                    } catch (e) {
                        responce.status(502).send({
                            responseMessage: "Something went Wrong...!!",
                            responseCode: 502,
                        });
                    }
                } else {
                    console.log("admin not found..!!!!!");
                    return responce.status(404).send({
                        responseMessage: "admin not found..!!!",
                        responseCode: 404,
                    });
                    // return res.send(test.Bad_Request)
                }
            });
        } catch (error) {
            console.log(error);
            return responce.status(500).send({
                responseMessage: "Internal Server Error......!!!",
                responseCode: 500,
            });
        }
    },

    editUserProfile: async(request, responce) => {
        try {
            userModel.findOne({email : request.body.email}, async(err, result)=> {
                if (err) {
                    return await responce.status(500).json({
                        responseCode: 500,
                        responseMesage: "Internal server error...!!!",
                    });
                }
                else {
                    // let Hpassword = await bcrypt.hash(request.body.password, 10);
                    userModel.findByIdAndUpdate(
                        { _id: result._id },
                        { $set: {
                            firstName: request.body.firstName,
                            lastName : request.body.lastName,
                            dateOfBirth : request.body.dob,
                            username : request.body.username,
                            mobile : request.body.mobile,
                            otp : request.body.otp,
                            // password : Hpassword,
                            Domain: request.body.Domain,
                            Secction : request.body.Secction,
                            Lebel : request.body.Lebel
                            } },
                        { new: true },
                        async (err, Data) => {
                            if (Data) {
                                return await responce.status(200).json({
                                    responseCode: 200,
                                    responsMessage: "User Updated by Admin...!!) ",
                                    responseResult: Data,
                                });
                            } else {
                                return await responce.status(400).json({
                                    responseCode: 400,
                                    responseMesage: "Something went Worng..!!",
                                });
                            }
                        }
                    );

                }
            })
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responseMesage: "somehting went worng....!!!",
            });
        }
    },

    ViewsDocuments: async (request, responce) => {
        try {
            userModel.find({ status : "Active"}, async (err, result) => {
                if (err) {
                    return responce.status(500).send({
                        responseMessage: "Internal Server Error..!!",
                        responseCode: 500,
                    });
                }
                else {
                    console.log(result);
                    return await responce.send(result)
                }
            }); 
        } catch (error) {
            console.log(error);
            return responce.status(502).send({
                responseMessage: "Something went Wrong...!!",
                responseCode: 502,
            });
        }
    },
    
};
