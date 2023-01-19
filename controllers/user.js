const userModel = require("../model/user");
const common = require("../helper/otp");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const config = require("../config/config")
const test = require("../helper/test");
const QRcode = require("qrcode");
const img = require("../helper/uploadImage");
const video = require("../helper/uploadvideo");
const Product_Model = require("../model/Products")
const v_token = require("../auth/auth");
const { request } = require("express");
const product_permission_Model = require("../model/User_product_Permission")
// const Product_Model = require("../model/Admin_Products"); 



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

    signup: async (request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async (err, result) => {
                if (err) {
                    return await res.status(500).send({
                        responseMessage: "Internal server error",
                        responseCode: 500,
                        error: err,
                    });
                } else if (result) {
                    return await responce.status(401).send({
                        responseMessage: "Email already exists..!!",
                        responseCode: 401,
                    });
                } else {
                    userModel.findOne({ username: request.body.username},async (err, result1)=> {
                        if (err) {
                            return await res.status(500).send({
                                responseMessage: "Internal server error",
                                responseCode: 500,
                                error: err,
                            });
                        } else if (result1) {
                            return await responce.status(401).send({
                                responseMessage: "Username already Taken..!!",
                                responseCode: 401,
                            });
                        }
                        else {
                            /* genrate OTP / time ...!! */
                            newotp = common.generateOtp();
                            request.body.otp = newotp;
                            request.body.otpTime = Date.now() + 180000;
                            request.body.dateOfBirth = request.body.dob;
                            request.body.date = new Date();

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

                            request.body.Domain = "React js";
                            request.body.Secction = "C";
                            request.body.Lebel = 1;
                            request.body.password = await bcrypt.hash(request.body.password, 10);

                            userModel(request.body).save(async (err1, res2) => {
                                if (err1) {
                                    return await responce.status(500).send({
                                        responseMessage: "Internal server error",
                                        responseCode: 500,
                                    });
                                } else {
                                    console.log("Signup Success...!!");
                                    return await responce.status(200).send({
                                        responseMessage: "Signup Success...!!",
                                        responseCode: 200,
                                        responsResult: [res2]
                                    });
                                }
                            });
                        }
                    })
                }
            });
        } catch (error) {
            console.log("Something Went Woring..!");
            console.log(error);
            return await responce.status(400).send({
                responseMessage: "Something went Worng..!!",
                responseCode: 400
            });
        }
    },

    login: async (request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async (err, result) => {
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
                            if (result.otpVerification == true) {
                                console.log("User is Live..!!");
                                /* Jwt token...!! */
                                const tokenData = create_token(result);
                                responce.send(tokenData);
                            } else {
                                console.log("otp is not verify..!!");
                                return responce.status(501).send({
                                    responseMessage: "Otp is not verify......!!",
                                    responseCode: 501,
                                });
                            }
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
                    console.log("user is not Registerd..!!");
                    return responce.status(404).send({
                        responseMessage: "user is Not Resitered..!!",
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

    otpVerifivation: async (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, async (err, res1) => {
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
                                if (res1.otpVerification == false) {
                                    userModel.findByIdAndUpdate(
                                        { _id: res1._id },
                                        { $set: { otpVerification: true } },
                                        { new: true },

                                        async (err, Data) => {
                                            if (Data) {
                                                console.log("OTP varifyed..!!");
                                                return await res.status(200).json({
                                                    responseCode: 200,
                                                    responsMessage: " Otp Verify.....!!) ",
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
                                    return await res.status(200).send({
                                        responseMessage: " Already OTP is Verifyed...!!",
                                        responseCode: 200,
                                    });
                                }
                            }
                            else {
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

    ViewsProfile: async (request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async (err, result) => {
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
            userModel.findOne({ email: request.body.email }, async (err, result) => {
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

    resetPassword: async (req, res) => {
        try {
            userModel.findOne({ email: req.body.email }, async (err, res1) => {
                if (err) {
                    return await res.status(404).send({
                        responsMessage: "user Not Found..!!",
                        responseCode: 404,
                    });
                } else {
                    let UPassword = req.body.Password;
                    let cPassword = req.body.cPassword;
                    if (UPassword == cPassword) {
                        let Hpassword = await bcrypt.hash(cPassword, 10);
                        userModel.findByIdAndUpdate(
                            { _id: res1._id },
                            { $set: { password: Hpassword } },
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

    img: (req, res) => {
        const file = req.files.photo;
        cloudinary.uploader.upload(file.tempFilePath, (err, res1) => {
            if (err) {
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

    resend: async (request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async (err, result) => {
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
                                ", Your new OTP is " +
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

    pegination: async (request, responce) => {
        try {
            const page = request.body.page;
            const sort = request.body.sort;
            var page_data;
            var skip;
            const limits = request.body.limits;

            if (page < 1) {
                return await responce.status(404).json({
                    responseCode: 404,
                    responsMessage: "page not found..."
                });
            }
            else {
                if (page = 1) {
                    skip = 0;
                }
                else {
                    skip = (page - 1) * limits
                }
                if (sort) {
                    page_data = await userModel.find().sort({ name: 1 }).skip(skip).limit(limits);
                }
                else {
                    page_data = await userModel.find().skip(skip).limit(limits);
                }
                return await responce.status(200).json({
                    responseCode: 200,
                    data: page_data
                });
            }
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responseMesage: "something went worng...!!!",
            });
        }
    },

    pegination1: async (request, responce) => {
        try {
            const page = request.body.page;
            const sort = request.body.sort;
            var page_data;
            var skip;
            const limits = request.body.limits;

            if (page < 1) {
                return await responce.status(404).json({
                    responseCode: 404,
                    responsMessage: "page not found..."
                });
            }
            else {
                if (page = 1) {
                    skip = 0;
                }
                else {
                    skip = (page - 1) * limits
                }
                if (sort) {
                    page_data = await userModel.find().sort({ name: 1 }).skip(skip).limit(limits);
                }
                else {
                    page_data = await userModel.find().skip(skip).limit(limits);
                }
                return await responce.status(200).json({
                    responseCode: 200,
                    data: page_data
                });
            }
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responseMesage: "something went worng...!!!",
            });
        }
    },

    QRcode: async (request, responce) => {
        try {
            const QRdata = request.body.name;
            QRcode.toDataURL(QRdata, QR = async (err, url) => {
                if (err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responseMesage: "Internal server error...!!!",
                    });
                }
                else {
                    console.log(url);
                    return await responce.status(200).json({
                        responseCode: 200,
                        responseMesage: "QR code success...!!!",
                        data: url
                    });
                }

            })
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responseMesage: "something went worng...!!!",
            });
        }
    },

    editProfile: async (request, responce) => {
        try {
            userModel.findOne({ email: request.body.email }, async (err, result) => {
                if (err) {
                    return await responce.status(500).json({
                        responseCode: 500,
                        responseMesage: "Internal server error...!!!",
                    });
                }
                else {
                    userModel.findByIdAndUpdate(
                        { _id: result._id },
                        {
                            $set: {
                                firstName: request.body.firstName,
                                lastName: request.body.lastName,
                                dateOfBirth: request.body.dob,
                                username: request.body.username,
                                mobile: request.body.mobile,
                            }
                        },
                        { new: true },
                        async (err, Data) => {
                            if (Data) {
                                return await responce.status(200).json({
                                    responseCode: 200,
                                    responsMessage: "Profile Updated by Admin...!!) ",
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

    filter: async (request, responce) => {
        try {
            var filterObject = {}
            const flSecction = request.body.Secction;
            const flDomain = request.body.Domain;
            console.log(flSecction);
            if (flSecction != '' && flDomain != '') {
                filterObject = {
                    $and: [
                        { Secction: flSecction },
                        { Domain: flDomain },
                    ]
                }
            }
            else if (flSecction != '' && flDomain == '') {
                filterObject = {
                    $and: [
                        { Secction: flSecction },
                    ]
                }
            }
            else if (flSecction == '' && flDomain != '') {
                filterObject = {
                    $and: [
                        { Domain: flDomain },
                    ]
                }
            }
            else {
                // const filterObject = {}
                return await responce.status(404).json({
                    responseCode: 404,
                    responsMessage: "filter with any 2 or 3 field....!!"
                });
            }
            const data = await userModel.find(filterObject);
            return await responce.status(200).json({
                responseCode: 200,
                responsResult: [data]
            });
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responsMessage: "something went worng....!!"
            });
        }
    },

    test: (req, res) => {
        let input = req.body.input;
        if (input == "success") {
            return res.send(test.success());
        }
        else if (input == "Created") {
            return res.send(test.Created());
        }
        else if (input == "Accepted") {
            return res.send(test.Accepted());
        }
        else if (input == "Accepted") {
            return res.send(test.Accepted());
        }
        else if (input == "Bad Request") {
            return res.send(test.Bad_Request());
        }
        else if (input == "Accepted") {
            return res.send(test.Accepted());
        }
        else if (input == "Bad Request") {
            return res.send(test.Bad_Request());
        }
        else if (input == "Unauthorized Access") {
            return res.send(test.Unauthorized());
        }
        else if (input == "Payment Required") {
            return res.send(test.Payment_Required());
        }
        else if (input == "Internal Server Error") {
            return res.send(test.Server_Error());
        }
        else if (input == "Bad Gateway") {
            return res.send(test.Bad_Gateway());
        }
        else if (input == "Service Unavailable") {
            return res.send(test.Service_Unavailable());
        }
        else if (input == "GateWay Time out") {
            return res.send(test.Gateway_Timeout());
        }
        else if (input == "Not Extended") {
            return res.send(test.Not_Extended());
        }
    },

    user_profile: async (request, responce) => {  
        try {
        img.uploadImage(request.files[0].path)
        console.log(request.files) 
        console.log(request.files[0].path)   
        return await responce.status(200).json({    
            responseCode: 200,
            responseMesage: "image updated succes...!!",
            responseResult: [request.files],
        });
        } catch (error) {
            console.log(error);
        }
    },

    user_video: async (request, responce) => {  
        try {
            video.uploadVideo(request.files[0].path)
            console.log(request.files) 
            console.log(request.files[0].path)   
            return await responce.status(200).json({    
                responseCode: 200,
                responseMesage: "video updated success..!!!",
                responseResult: [request.files],
            });
        } catch (error) {
            console.log("Error from Controller API :--",error);
        }
    },

    add_Product : async (request, responce) => {
        try { 
            Product_Model.findOne({Product_ID : request.body.Product_ID}, async(err, result) => {
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "something went worng....!!"
                    });
                }
                else if (result) {
                    return await responce.status(201).json({
                        responseCode: 201,
                        responsMessage: "Product is allready added....!!"
                    });
                }
                else {

                    Product_Model(request.body).save(async(err, res) => {
                        if (err) {
                            return await responce.status(500).send({
                                responseMessage: "Server Error...!!",
                                responseCode: 500,
                            });
                        }
                        else {
                            console.log("Product is added...!!");
                            return await responce.status(200).send({
                                responseMessage: "Product is added...!!",
                                responseCode: 200,
                                responsResult: [res]
                            });
                        }
                    })
                }
            });
            
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responsMessage: "something went worng....!!"
            });
        }
    },

    // add_Product : async (request, responce) => {
    //     try {
    //         userModel.findOne({email : request.body.email}, async(err, result)=>{
    //             if(err) {
    //                 return await responce.status(400).json({
    //                     responseCode: 400,
    //                     responsMessage: "Server Error....!"
    //                 });
    //             }
    //             else if (result) {
    //                 console.log(result.username)
    //                 var userProduct_ID = request.body.Product_ID + "-" + result.username
    //                 console.log(userProduct_ID);
    //                 Product_Model.findOne({Product_ID : userProduct_ID}, async(err, result1) => {
    //                     if(err) {
    //                         return await responce.status(400).json({
    //                             responseCode: 400,
    //                             responsMessage: "Server Error....!"
    //                         });
    //                     }
    //                     else if (result1) {
    //                         return await responce.status(201).json({
    //                             responseCode: 201,
    //                             responsMessage: "Product is allready added....!!"
    //                         });
    //                     }
    //                     else {
    //                         request.body.Product_ID = userProduct_ID;
    //                         Product_Model(request.body).save(async(err, res) => {
    //                             if (err) {
    //                                 return await responce.status(201).send({
    //                                     responseMessage: "Product is required...!!",
    //                                     responseCode: 201,
    //                                 });
    //                             }
    //                             else {
    //                                 console.log("Product is added...!!");
    //                                 return await responce.status(200).send({
    //                                     responseMessage: "Product is added...!!",
    //                                     responseCode: 200,
    //                                     responsResult: [res]
    //                                 });
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //             else {
    //                 return await responce.status(404).send({
    //                     responseMessage: "User Not Found.....!!",
    //                     responseCode: 404,
    //                 });
    //             }
    //         })
    //     } catch (error) {
    //         return await responce.status(400).json({
    //             responseCode: 400,
    //             responsMessage: "something went worng....!!"
    //         });
    //     }
    // },

    get_product_permission: async(request, responce) =>{
        userModel.findOne({_id : request.body.userID} , async (err, result) => {
            if(err) {
                return await responce.status(400).json({
                    responseCode: 400,
                    responsMessage: "Server Error....!"
                });
            }
            else if (!result){
                return await responce.status(404).json({
                    responseCode: 404,
                    responsMessage: "User not found with this ID...!"
                });
            }
            else {
                product_permission_Model(request.body).save( async(err, result1)=>{
                    if (err) {
                        return await responce.status(400).json({
                            responseCode: 400,
                            responsMessage: "Server Error....!"
                        });
                    }
                    else {
                        return await responce.status(200).json({
                            responseCode: 200,
                            responsMessage: "Permission made....!",
                            responsResult : result1
                        });
                    }

                })
            }
        })
    },


    very: (request,  responce) =>{
        product_permission_Model.findOne({userID : request.body.id}, (err, res)=>{
            if(err) {
                console.log(err);
            }
            else {
                if(res.permission == "active") {
                    console.log("you are Active...!!");
                }
                else {
                    console.log("User is not active.....!!");
                }
            }
        })
    },

    add_Product : async (request, responce) => {
        try {
            userModel.findOne({email : request.body.email}, async(err, result)=>{
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "Server Error....!"
                    });
                }
                else if (result) {
                    const id = result._id;
                    console.log("==========",id);
                    product_permission_Model.findOne({userID : id}, async(err, data)=>{
                        if(err) {
                            return await responce.status(400).json({
                                responseCode: 400,
                                responsMessage: "Server Error....!"
                            });
                        }
                        else if(data) {
                            console.log("---------------------------------",data.userID);
                            const Userpermission = await result.populate('userID');
                            console.log(Userpermission);
                            if(Userpermission.permission == "Active") {
                                var userProduct_ID = request.body.Product_ID + "-" + result.username
                                console.log(userProduct_ID);
                                Product_Model.findOne({Product_ID : userProduct_ID}, async(err, result2) => {
                                    if(err) {
                                        return await responce.status(400).json({
                                            responseCode: 400,
                                            responsMessage: "Server Error....!"
                                        });
                                    }
                                    else if (result2) {
                                        return await responce.status(201).json({
                                            responseCode: 201,
                                            responsMessage: "Product is allready added....!!"
                                        });
                                    }
                                    else {
                                        request.body.Product_ID = userProduct_ID;
                                        Product_Model(request.body).save(async(err, res) => {
                                            if (err) {
                                                return await responce.status(201).send({
                                                    responseMessage: "Product is required...!!",
                                                    responseCode: 201,
                                                });
                                            }
                                            else {
                                                console.log("Product is added...!!");
                                                return await responce.status(200).send({
                                                    responseMessage: "Product is added...!!",
                                                    responseCode: 200,
                                                    responsResult: [res]
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        }
                        else {
                            console.log("Dont have Permission to added...!!");
                            return await responce.status(201).send({
                                responseMessage: "Dont have Permission to added...!!",
                                responseCode: 201,
                            });
                        }
                    })
                }
                else {
                    return await responce.status(404).send({
                        responseMessage: "User Not Found.....!!",
                        responseCode: 404,
                    });
                }
            })
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responsMessage: "something went worng....!!"
            });
        }
    },

    get_Product : async(request, responce) => {
        try {
            userModel.findOne({email: request.body.email}, async(err, result) =>{
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "Server Error....!"
                    });
                }
                else if(!result) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "user not found.....!"
                    });
                }
                else {
                    var userProduct_ID = request.body.Product_ID + "-" + result.username
                    Product_Model.findOne({Product_ID : userProduct_ID}, async(err, result) => {
                        if(err) {
                            return await responce.status(400).json({
                                responseCode: 400,
                                responsMessage: "Server Error....!"
                            });
                        }
                        else if(result) {
                            console.log(" Result.. : ", result);
                            return await responce.status(200).json({
                                responseCode: 200,
                                responsMessage: "Result.. :",
                                responsResult : result
                            });
                        }
                        else {
                            return await responce.status(201).json({
                                responseCode: 201,
                                responsMessage: "Product Not Found....!"
                            });
                        }
                    })
                }
            })
        } catch (error) {
            return await responce.status(500).json({
                responseCode: 500,
                responsMessage: "something went worng....!!"
            });
        }
    },

    update_product : async(request, responce) => {
        try {
            userModel.findOne({email: request.body.email}, async(err, result) =>{
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "server Error....!"
                    });
                }
                else if (!result) {
                    return await responce.status(404).json({
                        responseCode: 404,
                        responsMessage: "user not found.....!"
                    });
                }
                else {
                    var userProduct_ID = request.body.Product_ID + "-" + result.username
                    console.log(userProduct_ID);
                    Product_Model.findOne({Product_ID : userProduct_ID}, async(err, result1) =>{
                        if(err) {
                            return await responce.status(400).json({
                                responseCode: 400,
                                responsMessage: "server error....!"
                            });
                        }
                        else if(!result1) {
                            return await responce.status(400).json({
                                responseCode: 400,
                                responsMessage: "Product not found.....!"
                            });
                        }
                        else {
                            console.log("...line working");
                            // console.log(result._id);

                            Product_Model.findByIdAndUpdate(
                                { _id: result1._id },
                                {
                                    $set: {
                                        Product_qty: request.body.Product_qty,
                                        Manufacture_Date: request.body.Manufacture_Date,
                                        Expiry_Date: request.body.Expiry_Date
                                    }
                                },
                                { new: true },
                                async (err, Data) => {
                                    if (Data) {
                                        return await responce.status(200).json({
                                            responseCode: 200,
                                            responsMessage: "Product Updated...!!) ",
                                            responseResult: Data,
                                        });
                                    } else {
                                        return await responce.status(500).json({
                                            responseCode: 500,
                                            responseMesage: "Something went Worng..!!",
                                        });
                                    }
                                }
                            );  
                        }
                    })
                }
            })
        } catch (error) {
            return await responce.status(500).json({
                responseCode: 500,
                responsMessage: "something went worng....!"
            });
        }
    },

    Search_Product: async(request, responce)=>{ 
        try {
            var search = request.body.search;
            Product_Model.find({"Name": { $regex : ".*"+search+ ".*", $options : "i"}}, async(err, result) =>{
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "Server Error....!",
                    });
                }
                 else if(result) {
                    return await responce.status(200).json({
                        responseCode: 200,
                        responsMessage: "Result....!",
                        responsResult: result
                    });
                }
                else {
                    return await responce.status(404).json({
                        responseCode: 404,
                        responsMessage: "Not Found....!"
                    });
                }
            })
        } catch (error) {
            return await responce.status(500).json({
                responseCode: 500,
                responsMessage: "something went worng....!"
            });
        }
    },

    // Search_Product: async(request, responce)=>{
    //     try {
    //         // var search = request.body.search; 
    //         // const data = user_Product_Model.find( { Name: { $gt: "Apple" } } ).sort({Name:1}).limit(3); 
    //         // return await responce.status(200).json({
    //         //     responseCode: 200,
    //         //     responsMessage: "Result....!",
    //         //     responsResult : data
    //         // });

    //         var search = request.body.search;
    //         user_Product_Model.find({"Name": { $regex : ".*"+search+ ".*"}}, async(err, result) =>{
    //             if(result.length > 0) {
    //                 // const page = request.body.page;
    //                 // const sort = request.body.sort; 
    //                 // var page_data = {};
    //                 // var skip;
    //                 // const limits = 5;

    //                 // if (page < 1) {
    //                 //     return await responce.status(404).json({
    //                 //         responseCode: 404,
    //                 //         responsMessage: "page not found..."
    //                 //     });
    //                 // }
    //                 // else {
    //                 //     if (page == 1) {
    //                 //         skip = 0;
    //                 //     }
    //                 //     else {
    //                 //         skip = (page - 1) * limits
    //                 //     }
    //                 //     if (sort) {
    //                 //         page_data = await userModel.find().sort({ price: 1 }).skip(skip).limit(limits);
    //                 //     }
    //                 //     else {
    //                 //         page_data = await userModel.find().skip(skip).limit(limits);
    //                 //     }
    //                 //     return await responce.status(200).json({
    //                 //         responseCode: 200,
    //                 //         data: page_data(result)
    //                 //     });
    //                 // }
    //                 return await responce.status(200).json({
    //                     responseCode: 200,
    //                     responsMessage: "Result....!",
    //                     responsResult: result
    //                 });
    //             }
    //             else {
    //                 return await responce.status(404).json({
    //                     responseCode: 404,
    //                     responsMessage: "Not Found....!"
    //                 });
    //             }
    //         })
    //     } catch (error) {
    //         return await responce.status(500).json({
    //             responseCode: 500,
    //             responsMessage: "something went worng....!"
    //         });
    //     }
    // }



    /**
     * in the Searching API user is geting product from the DB.
     * in the DB : 
     *          1. admin can add the poduct with Product ID
     *          2. User can add product with product ID ( ProductID + username [ that we can identify the product..])
     */

    


};








/*
aggregation
cron job
file system
multer

FCM     //  on live project.....
payment Gateway    // on live project 
*/