const express = require('express');
const app = express();
require('./db/dbconnection');
const userRouter = require("./routes/userRouter");
const hbs = require("hbs");

const fileUpload = require('express-fileupload');app.use(fileUpload({
    useTempFiles: true
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
                                            
app.use("/api/v1/user", userRouter, (req, res) => {
});

app.use("/user", userRouter, (req, res) => {
});

app.listen(3000,()=>{
    console.log("server is running on 5000");
});

 