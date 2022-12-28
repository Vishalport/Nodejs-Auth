const userRouter = require("express").Router();
const jsonPaeser = require("express");
const user = require('../controllers/user');
const Modeluser = require('../model/user');


userRouter.post('/signup', user.signup,jsonPaeser,()=> {
});

userRouter.post('/verify',user.otpVerifivation,()=> {
});

userRouter.get('/login', user.login,()=> {
});

userRouter.get('/Views',user.ViewsDocuments,()=> {
});

userRouter.post('/forgate',user.forgatePassword,()=> {
});

userRouter.post('/reset',user.resetPassword,()=> {
});

userRouter.get('/token',user.verifyToken,()=> {
});

module.exports = userRouter;