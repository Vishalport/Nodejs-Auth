const adminRouter = require("express").Router();
const admin = require('../controllers/admin');


// adminRouter.post('/signup',admin.adminSignup,()=>{
// })

adminRouter.get('/login',admin.adminLogin,()=> {
});

adminRouter.post('/edit_User/Profile', admin.editUserProfile,()=>{
})

adminRouter.get('/Views',admin.ViewsDocuments,()=> {
});




module.exports = adminRouter;