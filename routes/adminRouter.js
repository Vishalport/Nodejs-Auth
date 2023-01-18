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

adminRouter.post('/edit/static',admin.StaticContaint,()=> {
});

adminRouter.post('/new/product',admin.add_Product,()=> {
});

adminRouter.post('/delete/product',admin.remove_Product,()=> {
});

adminRouter.get('/get/product',admin.get_Product,()=> {
});

adminRouter.post('/update/product', admin.update_product,()=>{
});



module.exports = adminRouter;