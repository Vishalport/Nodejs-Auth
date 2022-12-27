const userRouter = require("express").Router();
const jsonPaeser = require("express");
const user = require('../controllers/user');
const Modeluser = require('../model/user');


userRouter.post('/signup', user.signup,jsonPaeser,(req,res)=> {
});

userRouter.post('/verify',user.otpVerifivation,(req,res)=> {
});

userRouter.get('/login', user.login,()=> {
});

userRouter.post('/forgate',user.forgatePassword,(req, res)=> {
});

userRouter.get('/Views',user.ViewsDocuments,(req, res)=> {
});

userRouter.get('/token',user.TokenVerifivation,(req, res)=> {
});

module.exports = userRouter;