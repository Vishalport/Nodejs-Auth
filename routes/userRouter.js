const userRouter = require("express").Router();
const jsonPaeser = require("express");
const user = require('../controllers/user');
const auth = require('../auth/auth');


userRouter.post('/signup', user.signup,jsonPaeser,()=> {
});

userRouter.post('/verify',user.otpVerifivation,()=> {
});

userRouter.get('/login',user.login,()=> {
});

userRouter.get('/Views', auth.verifyToken, user.ViewsDocuments,()=> {
});

userRouter.post('/forgate',user.forgatePassword,()=> {
});

userRouter.post('/reset',user.resetPassword,()=> {
});

userRouter.get('/token', auth.verifyToken,()=> {
});

userRouter.post('/img',user.img,()=> {
});

userRouter.get('/test',user.test,()=> {
});

module.exports = userRouter;