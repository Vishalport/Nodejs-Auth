var admin = require('../model/admin');

var admin1 = {
    name: "Admin",
    email: "adminss@gmail.com",
    password : "Admin@123"
}

admin.create(admin1, function(e) {
    if (e) {
        throw e;
    }
    else {
        console.log("Admin is Created..!!!");
    }
});