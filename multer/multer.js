const express = require('express')
const multer  = require('multer')




const upload = multer({ dest: 'uploads/' })

module.exports = {
    storage : multer.diskStorage({
        destination : function(req, res,cd) {
            cd(null, './public/upload/')
        },
        filename: function(req, req, cd) {
            cd(null, Data.now()+file.originaname)
        }
    }),

    upload : multer({storage:this.storage})
}

