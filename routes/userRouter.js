const userRouter = require("express").Router();
const user = require('../controllers/user');
const auth = require('../auth/auth');
const multer = require("multer");


const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'upload')},
  
  filename:function(req, file,cb){
     const name = Date.now()+'-'+file.originalname;
     cb(null,name)
  }
});
const upload = multer({storage:storage});


const videoStorage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'videos')},
  // destination: 'videos', 
  filename:function(req, file,cb){
    const name = Date.now()+'-'+file.originalname;
    cb(null,name)
 }
});
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
       return cb(new Error('Please upload a video'))
    }
    cb(undefined, true)
 }
});


userRouter.post('/signup',user.signup,()=> {
});

userRouter.post('/verify',user.otpVerifivation,()=> {
});

userRouter.get('/login',user.login,()=> {
});

userRouter.get('/Views/profile', auth.verifyToken, user.ViewsProfile,()=> {
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

userRouter.post('/profile/edit',auth.verifyToken,user.editProfile,()=>{
});

userRouter.get('/filter', user.filter,()=>{
});

userRouter.post('/img',upload.array('upload_pic'), user.user_profile,(req, res)=> {
  console.log(req.file);
}, (error, req, res1) => {
  res1.status(400).send({ error: error.message })
});

userRouter.post('/video', videoUpload.array('upload_video'), user.user_video,(req, res) => {
  console.log();(req.file)
}, (error, req, res1) => {
   res1.status(400).send({ error: error.message })
})




userRouter.get('/test',user.test,()=> {
});


module.exports = userRouter;