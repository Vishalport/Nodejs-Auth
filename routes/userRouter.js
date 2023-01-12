const userRouter = require("express").Router();
const user = require('../controllers/user');
const auth = require('../auth/auth');
// const multer = require("multer");
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//     }
// })
// const upload = multer({ storage: storage })

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, path.join(__dirname, '../public/userImages'), function(error, success){
            if(error) throw error
        });
    },
    filename:function(req, file,cb){
       const name = Date.now()+'-'+file.originalname;
        cb(null, name, function(error1, success1){
            if(error1) throw error1
        })
    }
});
const upload = multer({storage:storage});

userRouter.post('/signup',user.signup,()=> {
});

userRouter.post('/verify',user.otpVerifivation,()=> {
});

userRouter.get('/login',user.login,()=> {
});

userRouter.get('/Views/profile', auth.verifyToken, user.ViewsProfile,()=> {
});

userRouter.get('/admin/Views',user.ViewsDocuments,()=> {
});

userRouter.post('/forgate',user.forgatePassword,()=> {
});

userRouter.post('/reset',user.resetPassword,()=> {
});

userRouter.get('/token', auth.verifyToken,()=> {
});

userRouter.post('/resend', user.resend,()=> {
});

userRouter.get('/page', user.pegination,()=>{
});

userRouter.post('/QRcode', user.QRcode,()=> {
});

userRouter.post('/profile/edit',user.editProfile,()=>{
})

userRouter.post('/img',upload.single('photo'),user.img,(req, res, next)=> {
  console.log(req.file);
});






userRouter.get('/test',user.test,()=> {
});


module.exports = userRouter;