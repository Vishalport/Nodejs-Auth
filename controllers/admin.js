const bcrypt = require("bcryptjs");
var adminModel = require('../model/admin');
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Product_Model = require("../model/Products");
const StaticModal = require("../model/StaticContaint")

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

    StaticContaint: async (request, responce) => {
        try {
            StaticModal.findOne({ title: request.body.title }, async (err, result) => {
                if (err) {
                    return await responce.status(500).json({
                        responseCode: 500,
                        responseMesage: "Internal server error...!!!",
                    });
                }
                else {
                    StaticModal.findByIdAndUpdate(
                        { _id: result._id },
                        {
                            $set: {
                                type: request.body.type,
                                discription: request.body.discription,
                                title: request.body.title
                            }
                        },
                        { new: true },
                        async (err, Data) => {
                            if (Data) {
                                return await responce.status(200).json({
                                    responseCode: 200,
                                    responsMessage: "update in Static Containt...!!) ",
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

    add_Product : async (request, responce) => {
        try {
            Product_Model.findOne({Product_ID : request.body.Product_ID}, async(err, result) => {
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "something went worng....!"
                    });
                }
                else if (result) {
                    return await responce.status(201).json({
                        responseCode: 201,
                        responsMessage: "Product is allready added....!!"
                    });
                }
                else {
                    // request.body.Product_type = request.body.type;
                    // request.body.Product_ID = request.body.id;
                    // request.body.Product_qty = request.body.qty;
                    // request.body.Manufacture_Date = request.body.Manufacture;
                    // request.body.Expiry_Date = request.body.Expiry;
                    // request.body.Name = request.body.Name;

                    // if(type != '', id != '', qty != '', Manufacture !='', Expiry != '', Name != '') {
                    // if(request.body.Product_type != '', request.body.Product_ID != '', request.body.Product_qty != '', request.body.Manufacture_Date !='', request.body.Expiry_Date != '', request.body.Name != '') { 
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
                    // }
                    // else {
                        // return await responce.status(201).send({
                        //     responseMessage: "Product is required...!!",
                        //     responseCode: 201,
                        // });
                    // }
                }
            })
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responsMessage: "something went worng....!!"
            });
        }
    },

    remove_Product : async(request, responce) => {
        try {
            Product_Model.findOne({Product_ID : request.body.Product_ID}, async(err, result) => {
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "something went worng....!"
                    });
                }
                else if(result) {
                    Product_Model.findByIdAndDelete({ _id: result._id }, async(err, data) => {
                        if (err){
                            console.log(err);
                            return await responce.status(400).json({
                                responseCode: 400,
                                responsMessage: "something went worng....!"
                            });
                        }
                        else{
                            console.log(" product is Deleted : ", data);
                            return await responce.status(200).json({
                                responseCode: 200,
                                responsMessage: "Product is Deleted.....!",
                                responsResult : data
                            });
                        }
                    });
                }
                else {
                    return await responce.status(201).json({
                        responseCode: 201,
                        responsMessage: "Product Not Found....!"
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
            Product_Model.findOne({Product_ID : request.body.Product_ID}, async(err, result) => {
                if(err) {
                    return await responce.status(400).json({
                        responseCode: 400,
                        responsMessage: "something went worng....!"
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
        } catch (error) {
            return await responce.status(400).json({
                responseCode: 400,
                responsMessage: "something went worng....!!"
            });
        }
    },

    update_product : async(request, responce) => {
        try {
            Product_Model.findOne({Product_ID : request.body.Product_ID}, async(err, result1) =>{
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
        } catch (error) {
            return await responce.status(500).json({
                responseCode: 500,
                responsMessage: "something went worng....!"
            });
        }
    },
    
};
