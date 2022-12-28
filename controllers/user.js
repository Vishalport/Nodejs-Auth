const userModel = require("../model/user");
const common = require("../helper/otp");
const bcrypt = require("bcryptjs");
const Ctoken = require("../helper/auth");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
jwtKey = "jwt";

module.exports = {
    // API Development...!!

    signup: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, result) => {
                if (err) {
                    return res.status(500).send({
                        responseMessage: "Internal server error",
                        responseCode: 500,
                        error: err,
                    });
                } else if (result) {
                    return res.status(500).send({
                        responseMessage: "email already exists",
                        responseCode: 401,
                        error: [],
                    });
                } else {
                    /* genrate OTP...!! */
                    let newotp = common.generateOtp();
                    req.body.otp = newotp;

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
                        to: req.body.email,
                        subject: "OTP veryfication..",
                        html:
                            "<p> Hii " + ", Your OTP is " + newotp + "Verify your OTP</a>",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("mail has been sent:- ", info.response);
                        }
                    });

                    /*
                     * Adding Curent Time for OTP Verification...!!
                     */
                    req.body.otpTime = Date.now() + 180000;

                    /*
                     * hashing the password..!!
                     */
                    let password = bcrypt.hashSync(req.body.password);
                    req.body.password = password;

                    /* compair Password with Postman..!!  */
                    let compair_password = bcrypt.hashSync(req.body.password);
                    let newresult = bcrypt.compareSync(
                        req.body.password,
                        compair_password
                    );

                    userModel(req.body).save((err1, res1) => {
                        if (err1) {
                            return res.status(500).send({
                                responseMessage: "Internal server error",
                                responseCode: 500,
                                error: err1,
                            });
                        } else {
                            return res.status(200).send({
                                responseMessage: "OTP is Send to the Email..!!",
                                responseCode: 200,
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(502).send({
                responseMessage: "Something went wrong",
                responseCode: 502,
                error: error,
            });
        }
    },

    otpVerifivation: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {
                // console.log(res1.email);
                // console.log(res1.otp);
                // console.log(res1.otpTime);
                if (err) {
                    console.log("Email is not in Database..!!");
                    return res.status(404).send({
                        responseMessage: "Email is not in database..!!",
                        responseCode: 404,
                    });
                } else {
                    try {
                        if (res1.otp == req.body.otp) {
                            /* Compair OTP at real time...!! */
                            if (res1.otpTime >= Date.now()) {
                                console.log("OTP verifyed..!!!");
                                return res.status(200).send({
                                    responseMessage: "Signup success and OTP Verifyed...!!",
                                    responseCode: 200,
                                });
                            } else {
                                console.log("OTP Time Out Please resend it...!!");
                                return res.status(501).send({
                                    responseMessage: "OTP Time Out.. Resnr it..!!",
                                    responseCode: 501,
                                });
                            }
                        } else {
                            console.log("OTP not valid..!!");
                            return res.status(201).send({
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
            return res.status(502).send({ responseCode: "Something went Worng..!!" });
        }
    },

    login: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {
                if (err) {
                    return res.status(500).send({
                        responseMessage: "Internal Server Error..!!",
                        responseCode: 500,
                    });
                } else if (res1) {
                    try {
                        const password = req.body.password;
                        let check = bcrypt.compareSync(password, res1.password);
                        if (check === false) {
                            console.log("mail or Password IncorrecEt..!!");
                            return res.status(501).send({
                                responseMessage: "Email or Password Does't match.....!!",
                                responseCode: 501,
                            });
                        } else {
                            console.log("User is Live..!!");
                            /* Jwt token...!! */
                            const token = jwt.sign({ res1 }, jwtKey);
                            res.send(token);
                        }
                    } catch (e) {
                        res.status(502).send({
                            responseMessage: "Something went Wrong...!!",
                            responseCode: 502,
                        });
                    }
                } else {
                    console.log("Email is not Registerd..!!");
                    return res.status(404).send({
                        responseMessage: "Email is Not Resitered..!!",
                        responseCode: 404,
                    });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                responseMessage: "Internal Server Error..!!!",
                responseCode: 500,
                error: error,
            });
        }
    },

    ViewsDocuments: (req, res) => {
        try {
            userModel.find({}, (err, res1) => {
                if (err) {
                    return res1.status(500).send({
                        responseMessage: "Internal Server Error..!!",
                        responseCode: 500,
                    });
                } else {
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(502).send({
                responseMessage: "Something went Wrong...!!",
                responseCode: 502,
                error: error,
            });
        }
    },

    verifyToken: (req, res, next) => {

        const token = req.body.token;
        if (!token) {
            res.status(201).send({ responsMessage: "Token is Required..!!", responseCode: 201 });
        }
        try {
            const decode = jwt.verify(token, jwtKey);
            req.token = decode;
            res.status(200).send("Token. verifyed..!!")
        } catch (error) {
            res.status(400).send("Invalid Token...!!")
        }
        return next();
    },

    forgatePassword: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {
                if (err) {
                    return res.status(404).send({
                        responseMessage: "Email is not In the Database..!!",
                        responseCode: 404,
                    });
                } else {
                    if (res1) {
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
                            to: req.body.email,
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

                        console.log(res1._id);
                        userModel.findByIdAndUpdate(
                            { _id: res1._id },
                            { $set: { otp: newotp, otpTime: expTimeOtp } },
                            { new: true },
                            (err, Data) => {
                                if (Data) {
                                    res.status(200).json({
                                        responseCode: 200,
                                        responsMessage: "check your mail OTP is send :) ",
                                        responseResult: Data,
                                    });
                                } else {
                                    res.status(203).json({
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
            res.status(502).send({ responseCode: "Something went Worng..!!" });
            console.log("Something Went Woring..!");
        }
    },

    resetPassword: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, (err, res1) => {
                if (err) {
                    res.status(404).send({
                        responsMessage: "user Not Found..!!",
                        responseCode: 404,
                    });
                } else {
                    let UPassword = req.body.Password;
                    let cPassword = req.body.cPassword;
                    if(UPassword == cPassword) {
                        userModel.findByIdAndUpdate(
                            { _id: res1._id },
                            { $set: { password: cPassword} },
                            { new: true },
                            (err, Data) => {
                                if (Data) {
                                    res.status(200).json({
                                        responseCode: 200,
                                        responsMessage: "Password Updated...!!) ",
                                        responseResult: Data,
                                    });
                                } else {
                                    res.status(501).json({
                                        responseCode: 501,
                                        responseMesage: "Something went Worng..!!",
                                        responsResult: [],
                                    });
                                }
                            }
                        );
                    }
                    else {
                        res.status(201).json({
                            responseCode: 201,
                            responseMesage: "Cpassword and Password Don't match...!!!!",
                            responsResult: [],
                        });
                    }
                }
            });
        } catch (error) {
            res.status(502).send({
                responsMessage: "Something went worng..!!",
                responseCode: 502,
            });
        }
    }
};











// resetPassword: (req, res) => {
//     try {
//         userModel.findOne({ email: req.body.email }, (err, res1) => {
//             if (err) {
//                 res.status(404).send({
//                     responsMessage: "user Not Found..!!",
//                     responseCode: 404,
//                 });
//             } else {
//                 const password = req.body.password;
//                 let check = bcrypt.compareSync(password, res1.password);
//                 if (check === false) {
//                     console.log("old Password Not Match..!!");
//                     return res.status(501).send({
//                         responseMessage: "old Password Not Match..!!",
//                         responseCode: 501,
//                     });
//                 } else {
//                     if (req.body.otp == res1.otp) {
//                         if (res1.otpTime >= Date.now()) {
//                             userModel.findByIdAndUpdate(
//                                 { _id: res1._id },
//                                 { $set: { password: newPassword } },
//                                 { new: true },
//                                 (err, Data) => {
//                                     if (Data) {
//                                         res.status(200).json({
//                                             responseCode: 200,
//                                             responsMessage: "Password Updated..!!",
//                                             responseResult: Data,
//                                         });
//                                     }
//                                     else {
//                                         res.status(203).json({
//                                             responseCode: 203,
//                                             responseMesage: "invalid user",
//                                             responsResult: [],
//                                         });
//                                     }
//                                 }
//                             );
//                         } 
//                         else {
//                             res.status(504).send({
//                                 responsMessage: "OTP Time Expaire Resend the OTp...!!",
//                                 responseCode: 504,
//                             });
//                         }
//                     }
//                     else {
//                         res.status(201).send({
//                             responsMessage: "Invalid OTP..!!",
//                             responseCode: 201,
//                         });
//                     }
//                 }
              
//             }
//         });
//     } catch (error) {
//         res.status(502).send({
//             responsMessage: "Something went worng..!!",
//             responseCode: 502,
//         });
//     }
// }