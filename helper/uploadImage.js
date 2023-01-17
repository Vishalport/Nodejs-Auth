const cloudinary = require("cloudinary").v2; // here we require cloudinary

cloudinary.config({
    cloud_name: "dhdvtnehi",
    api_key: "516765691967195",
    api_secret: "VogCyCi7YWCwKUSHduwVxpd5VxE",
    secure: true,
});
  
module.exports = {
  uploadImage: (path) => {
    try {
      cloudinary.uploader.upload(path, (err, result) => {
        if (err) {
          console.log(err);
        } else if (!result) {
          console.log("image upload error....!!");
        } else {
          console.log(result);
        }
      });
    } catch {
      console.log(err);
    }
  },
}