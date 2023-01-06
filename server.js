const express = require('express');
const app = express();
require('./db/dbconnection');
const userRouter = require("./routes/userRouter");
const fileupload = require("express-fileupload");

app.use(express.json({ limit: "50mb" }));

app.use(fileupload({
    useTempFiles: true
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
                                            
app.use("/api/v1/user", userRouter, (req, res) => {
});

app.use("/user", userRouter, (req, res) => {
});

app.listen(3000,()=>{
    console.log("server is running on 3000");
});

 



// /home/administrator/snap/postman/184/Postman/files