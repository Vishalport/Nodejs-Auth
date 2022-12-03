const userModel = require('../model/user');
const common = require('../helper/otp');
const bcrypt = require('bcryptjs');
const otp = require('../helper/otp');
module.exports ={

    // api development

    // signup,login,otpverify,forgotpassword,resetpassword,resend otp,getProfile

    signup:(req,res)=>{
        try {
            userModel.findOne({email:req.body.email},(err,result)=>{
                if(err){
                    return res.status(500).send({responseMessage:"Internal server error",responseCode:501,error:err})

                }
                else if(result){
                    return res.status(500).send({responseMessage:"email already exists",responseCode:401,error:[]})
                }
                else { 
                /* genrate OTP...!! */
                    let newotp = common.generateOtp();
                    req.body.otp = newotp;
                    console.log(newotp);

                /* Adding Curent Time for OTP Verification...*/
                    req.body.otpTime = Date.now() + 180000
                /* hashing the password..!!  */
                    console.log(req.body.password);
                    let password = bcrypt.hashSync(req.body.password);
                    req.body.password = password;
                    console.log(password);

                 /* compair Password with Postman..!!  */
                    // let compair_password = bcrypt.hashSync(req.body.password);
                    // let newresult = bcrypt.compareSync(req.body.password, compair_password);
                    // console.log(compair_password,newresult);

                    console.log(req.body);

                    userModel(req.body).save((err1,res1)=>{
                        if(err1){
                            return res.status(500).send({responseMessage:"Internal server error",responseCode:501,error:err1})
        
                        }
                        else{
                            return res.status(200).send({responseMessage:"Signup success",responseCode:200,result:res1})
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(501).send({responseMessage:"Something went wrong",responseCode:501,error:error})
        }
    },


    otpVerifivation:(req, res)=>{
        try {
            userModel.findOne({email:req.body.email},(err, res1)=> {
                // console.log(res1.email);
                // console.log(res1.otp);
                // console.log(res1.otpTime);
                if(err){
                    console.log("Email is not in Database..!!");
                    return res.status(501).send({responseMessage:"Email is not in database..!!", responseCode:501});
                }
                else {
                    try {
                        if(res1.otp== req.body.otp) {
                        /* Compair OTP at real time...!! */
                            if(res1.otpTime >= Date.now()) {
                                console.log("OTP verifyed..!!!");
                            }
                            else {
                                console.log("OTP Time Out Please resend it...!!");
                            }
                        }
                        else {
                            console.log("OTP not valid..!!");
                        }
                    
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        } catch (error) {
            console.log("Something Went Woring..!");
            console.log(error);
            return res.status(501).send({responseCode:"Something went Worng..!!"});
            
        }
    },


    forgatePassword:(req, res)=> {
        try {
            userModel.findOne({email:req.body.email},(err, res1)=>{
                if(err) {
                    console.log("Email is not in the databse..!!");
                    return res.status(501).send({responseMessage:"Email is not In the Database..!!",responseCode:501});                 
                }
                else {
                    try {
                        if(res1.password == req.body.password) {
                            console.log("Password is Same As Proivous Password  Error(201)");
                            return res.status(201).send({responseMessage:"Please Enter Diffrent Password...!!"});
                        }
                        else {
                            console.log("old password :  "+res1.password);
                            try {
                                const updatePassword = userModel.findOneAndUpdate(res1.password, req.password);
                                console.log("Password is Updeated..!! :   "+req.body.password);
                                return res.status(200).send({responseMessage:"Password is Updated..!!", responseCode:200});

                            }catch(e) {
                                console.log(e);
                                return res.status(501).send({responseMessage:"Something went Worng..!!", responseCode:501})
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        }catch (error) {
            res.status(501).send({responseCode:"Something went Worng..!!"});
            console.log("Something Went Woring..!");
        } 
    },


    login:(req, res)=> {
        try {
            userModel.findOne({email:req.body.email}, (err, log_res)=> {
                if(err) {
                    return log_res.status(500).send({responseMessage:"Internal Server Error..!!", responseCode:500});
                }
                else if (log_res) {
                    try{
                        const email = req.body.email;
                        const password = req.body.password;
                        const useremail = userModel.findOne({email:email});
                        let check = bcrypt.compareSync(password,log_res.password)
                        if(check === false){
                            //password is incorrect
                        }
                        if(useremail.password === password) {
                            res.status(201).send({responseMessage:"User is Live..!!", responseCode:201})
                            console.log("User is Live..!!");
                        }else {
                            res.send("Email or Password Does't match..!!")
                        }
                    }catch(e) {
                        res.status(400).send({responseMessage:"Internal Server Error..!!!", responseCode:400})
                    }
                }
                else {
                    console.log("Email is not Registerd..!!");
                    return log_res.status(500).send({responseMessage:"Email is Not Resitered..!!", responseCode:500});
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(501).send({responseMessage:"Something went Wrong...!!", responseCode:501, error:error});
        }

    }

}

// type script
// callback hell

// HW   OTp matching ...!


