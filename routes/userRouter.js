const userRouter = require("express").Router();
const user = require('../controllers/user');
const Modeluser = require('../model/user');


userRouter.post('/signup',user.signup,(req,res)=> {
});

userRouter.post('/verify',user.otpVerifivation,(req,res)=> {
});

userRouter.post('/forgate',user.forgatePassword,(req, res)=> {
});

userRouter.get('/login', user.login,()=> {
});


module.exports = userRouter;