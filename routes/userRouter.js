const userRouter = require("express").Router();
const user = require('../controllers/user');
const auth = require('../auth/auth');
const multer = require("multer");
// const upload  = require('../multer/multer');
// const cloudinary = require('../cloudnary/cloudnary');
const fs = require('fs');
// const path = require("path");
// const { url } = require("inspector");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, process.cwd() + '/public/')
//     },
//     filename: function (req, file, cb) {
//         // generate the public name, removing problematic characters
//         const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
//         const timestamp = Date.now()
//         const extension = path.extname(file.originalname).toLowerCase()
//         cb(null, originalName + '_' + timestamp + extension)
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1 * 1024 * 1024 }, // 1 Mb
//     fileFilter: (req, file, callback) => {
//         const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg']
//         if (!(acceptableExtensions.some(extension => 
//             path.extname(file.originalname).toLowerCase() === `.${extension}`)
//         )) {
//             return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
//         }
//         callback(null, true)
//     }
// })

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

userRouter.post('/img',upload.single('photo'),user.img,(req, res, next)=> {
    console.log(req.file);
});


// userRouter.post('/add',upload('image'), (req, res) =>{
//     const uploader = (path) => cloudinary.uploads(path,'image')
//     if(req.method === 'post') {
//         const urls = []
//         const files = req.files
//         for(const file of files) {
//             const {path} = file
//             const newpath = uploader(path)
//             urls.push(newpath)

//             fs.unlinkSync(path)
//         }

//         console.log("uploded success..!!");
//         res.status(200).send({
//             data : urls
//         })
//     } else {
//         console.log("not uploded....!!");
//     }

// });

userRouter.get('/test',user.test,()=> {
});


module.exports = userRouter;