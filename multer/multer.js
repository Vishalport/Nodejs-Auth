const multer = require("multer");

module.exports = {
    storage : multer.diskStorage({
        destination : function(req, file,cd) {
            cd(null, './upload/')
        },
        filename: function(req, file, cd) {
            cd(null, Data.now()+'-'+file.originalname)
        }
    }),

    fileFilter : (req, file, cd )=> {
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cd(null, true )
        }
        else {
            console.log("file extention is diffrent..!!");
            cd({Message : 'unsuported file extation....!!'}, false)
        }
    },

    upload: multer( {
        // Storage: storage,
        limits : {fileSize : 1024 * 1024},
    })
}

