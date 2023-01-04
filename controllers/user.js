const userModel = require("../model/user");
const common = require("../helper/otp");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config")
const test = require("../helper/test");
const cloudinary = require("cloudinary").v2;

const create_token = (id)=> {
    try {
        const token = jwt.sign({ _id:id }, config.key);       
        return token; 
    } catch (error) {
        return res.status(500).send({
            responseMessage: "Error While Creating the Token....!!",
            responseCode: 500,
        });
    }
}

cloudinary.config({
    cloud_name : 'dhdvtnehi',
    api_key: '516765691967195',
    api_secret:'VogCyCi7YWCwKUSHduwVxpd5VxE'
});

module.exports = { 
    // API Development...!!

    signup: async(request, responce)=> {
        try {
            userModel.findOne({ email: request.body.email }, async (err, result) => {
                if (err) {
                    return res.status(500).send({
                        responseMessage: "Internal server error",
                        responseCode: 500,
                        error: err,
                    });
                } else if (result) {
                    return responce.status(401).send({
                        responseMessage: "email already exists..!!",
                        responseCode: 401,
                    });
                } else {
                    /* genrate OTP / time ...!! */
                    request.body.otp = common.generateOtp();
                    request.body.otpTime = Date.now() + 180000;

                    request.body.password = await bcrypt.hash(request.body.password, 10);
                    userModel(request.body).save((err1) => {
                        if (err1) {
                            return responce.status(500).send({
                                responseMessage: "Internal server error",
                                responseCode: 500,
                            });
                        } else {
                            return responce.status(200).send({
                                responseMessage: "Signup Success full...!!",
                                responseCode: 200,
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.log("Something Went Woring..!");
            console.log(error);
            return responce.status(400).send({
                responseMessage: "Something went Worng..!!", 
                responseCode:400
            });
        }
    },

    login: async(request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async(err, result) => {
                if (err) {
                    return responce.status(500).send({
                        responseMessage: "Internal Server Error..!!",
                        responseCode: 500,
                    });
                } else if (result) {
                    try {
                        const password = request.body.password;
                        const check = await bcrypt.compare(password, result.password);
                        if (check) {
                            console.log("User is Live..!!");
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
                    console.log("Email is not Registerd..!!");
                    return responce.status(404).send({
                        responseMessage: "Email is Not Resitered..!!",
                        responseCode: 404,
                    });
                    // return res.send(test.Bad_Request)
                }
            });
        } catch (error) {
            console.log(error);
            return responce.status(500).send({
                responseMessage: "Internal Server Error..!!!",
                responseCode: 500,
            });
        }
    },

    otpVerifivation: async(req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, async(err, res1) => {
                if (err) {
                    console.log("Email is not in Database..!!");
                    return await res.status(404).send({
                        responseMessage: "Email is not in database..!!",
                        responseCode: 404,
                    });
                } else {
                    try {
                        if (res1.otp == req.body.otp) {
                            /* Compair OTP at real time...!! */
                            if (res1.otpTime >= Date.now()) {
                                console.log("OTP verifyed..!!!");
                                return await res.status(200).send({
                                    responseMessage: "success and OTP Verifyed...!!",
                                    responseCode: 200,
                                });
                            } else {
                                console.log("OTP Time Out Please resend it...!!");
                                return await res.status(501).send({
                                    responseMessage: "OTP Time Out.. Resnr it..!!",
                                    responseCode: 501,
                                });
                            }
                        } else {
                            console.log("OTP not valid..!!");
                            return await res.status(201).send({
                                responseMessage: "OTP not Valid.!!",
                                responseCode: 201,
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        } catch (error) {
            console.log("Something Went Woring..!");
            console.log(error);
            return await res.status(502).send({ responseCode: "Something went Worng..!!" });
        }
    },

    ViewsDocuments: async(request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async(err, result) => {
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

    forgatePassword: async (request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async(err, result) => {
                if (err) {
                    return await responce.status(404).send({
                        responseMessage: "Email is not In the Database..!!",
                        responseCode: 404,
                    });
                } else {
                    if (result) {
                        let newotp = common.generateOtp();
                        let expTimeOtp = Date.now() + 180000;

                        const transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            requireTLS: true,
                            auth: {
                                user: "fortestingpurpose0077@gmail.com",
                                pass: "bztzdeyoecetitik",
                            },
                        });

                        const mailOptions = {
                            from: "fortestingpurpose0077@gmail.com",
                            to: request.body.email,
                            subject: "OTP veryfication..",
                            html:
                                "<p> Hii " +
                                ", Your Forgate Password OTP is " +
                                newotp +
                                " Verify your OTP</a>",
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("mail has been sent:- ", info.response);
                            }
                        });

                        // console.log(res1._id);
                        userModel.findByIdAndUpdate(
                            { _id: result._id },
                            { $set: { otp: newotp, otpTime: expTimeOtp } },
                            { new: true },
                            async (err, Data) => {
                                if (Data) {
                                    responce.status(200).json({
                                        responseCode: 200,
                                        responsMessage: "check your mail OTP is send :) ",
                                        responseResult: Data,
                                    });
                                } else {
                                    return await responce.status(203).json({
                                        responseCode: 203,
                                        responseMesage: "invalid user",
                                        responsResult: [],
                                    });
                                }
                            }
                        );
                    }
                }
            });
        } catch (error) {
            console.log("Something Went Woring..!");
            return await responce.status(502).send({ responseCode: "Something went Worng..!!" });
            
        }
    },

    resetPassword: async(req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, async(err, res1) => {
                if (err) {
                    return await res.status(404).send({
                        responsMessage: "user Not Found..!!",
                        responseCode: 404,
                    });
                } else {
                    let UPassword = req.body.Password;
                    let cPassword = req.body.cPassword;
                    if(UPassword == cPassword) {
                        let Hpassword = await bcrypt.hash(cPassword, 10);
                        userModel.findByIdAndUpdate(
                            { _id: res1._id },
                            { $set: { password: Hpassword} },
                            { new: true },
                            async (err, Data) => {
                                if (Data) {
                                    return await res.status(200).json({
                                        responseCode: 200,
                                        responsMessage: "Password Updated...!!) ",
                                        responseResult: Data,
                                    });
                                } else {
                                    return await res.status(501).json({
                                        responseCode: 501,
                                        responseMesage: "Something went Worng..!!",
                                    });
                                }
                            }
                        );
                    }
                    else {
                        return await res.status(201).json({
                            responseCode: 201,
                            responseMesage: "Cpassword and Password Don't match...!!!!",
                        });
                    }
                }
            });
        } catch (error) {
            return await res.status(502).send({
                responsMessage: "Something went worng..!!",
                responseCode: 502,
            });
        }
    },

    img:(req, res) => {
        const file  = req.files.photo;
        cloudinary.uploader.upload(file.tempFilePath,(err, res1)=> {
            if(err) {
                return res.status(500).send({
                    responseMessage: "Internal server error",
                    responseCode: 500
                });
            }
            else {
                console.log(res1);
                return res.status(200).send({
                    responseMessage: "Image is Uploded..!!",
                    responseCode: 200,
                });
            }
            
        });  
    },

    test: (req, res) => {
        let input = req.body.input;
            if(input == "success"){
                return res.send(test.success());
            }
            else if(input == "Created"){
                return res.send(test.Created());
            }
            else if(input == "Accepted"){
                return res.send(test.Accepted());
            }
            else if(input == "Accepted"){
                return res.send(test.Accepted());
            }
            else if(input == "Bad Request"){
                return res.send(test.Bad_Request());
            }
            else if(input == "Accepted"){
                return res.send(test.Accepted());
            }
            else if(input == "Bad Request"){
                return res.send(test.Bad_Request());
            }
            else if(input == "Unauthorized Access"){
                return res.send(test.Unauthorized());
            }
            else if(input == "Payment Required"){
                return res.send(test.Payment_Required());
            }
            else if(input == "Internal Server Error"){
                return res.send(test.Server_Error());
            }
            else if(input == "Bad Gateway"){
                return res.send(test.Bad_Gateway());
            }
            else if(input == "Service Unavailable"){
                return res.send(test.Service_Unavailable());
            }
            else if(input == "GateWay Time out"){
                return res.send(test.Gateway_Timeout());
            }
            else if(input == "Not Extended"){
                return res.send(test.Not_Extended());
            }
    },

};