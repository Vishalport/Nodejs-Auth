const adminRouter = require("express").Router();
const admin = require('../controllers/admin');


adminRouter.post('/signup',admin.adminSignup,()=>{
})

adminRouter.get('/login',admin.adminLogin,()=> {
});

adminRouter.post('/edit_User/Profile', admin.editUserProfile,()=>{
})




module.exports = adminRouter;