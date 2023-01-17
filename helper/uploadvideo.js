const cloudinary = require("cloudinary").v2; 
cloudinary.config({
    cloud_name: "dhdvtnehi",
    api_key: "516765691967195",
    api_secret: "VogCyCi7YWCwKUSHduwVxpd5VxE",
    secure: true,
});
  
module.exports = {
    uploadVideo: (path) => {
       try {
        cloudinary.uploader.upload(path, 
            { resource_type: "video", 
                chunk_size: 6000000,
                eager: [
                  { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
                  { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
                eager_async: true},
        (err, result) => {
                if (err) {
                    console.log(err);
                } else if (!result) {
                    console.log("video upload error....!!");
                } else {
                    console.log(result);
                }
        });
       } catch (error) {
        console.log(error);
       }
    },
}