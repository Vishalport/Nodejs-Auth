const userRouter = require("express").Router();
const user = require('../controllers/user');
const auth = require('../auth/auth');
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/photo/my-uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

userRouter.post('/signup',user.signup,()=> {
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

userRouter.post('/photo',upload.single('photo'),user.img,(req, res, next)=> {
    console.log(req.file);
});


userRouter.post('/add',upload.single('photo'),()=> {
});

userRouter.get('/test',user.test,()=> {
});


module.exports = userRouter;