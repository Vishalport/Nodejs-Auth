var admin = require('../model/admin');
const bcrypt = require("bcryptjs");


var admin1 = {
    name: "Admin",
    email: "admin@gmail.com",
    password : "Admin"
} 
 
admin.findOne({email : "admin@gmail.com"},(err, result)=> {
    if(result){
        console.log("admin is already added.....!!!");
    }
    else {
        admin.create(admin1, function(e) {
            if (e) {
                throw e;
            }
            else {
                console.log("admin added.....!!!");
            }
        });
    }
})