const { promises } = require("nodemailer/lib/xoauth2");

const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: 'dhdvtnehi',
    api_key: '516765691967195',
    api_secret: 'VogCyCi7YWCwKUSHduwVxpd5VxE'
});


module.uploads =(file, folder)=> {
    return new promises(resolve =>{
        cloudinary.uploader.upload(file, (result)=> {
            resolve({
                url: result.url,
                id:result.public_id
            })
        },
        {
            resource_type: "auto",
            folder:folder
        })
    })
}