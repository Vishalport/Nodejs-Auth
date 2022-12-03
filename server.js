const express = require('express');
const app = express();
require('./db/dbconnection');
const userRouter = require("./routes/userRouter");
const hbs = require("hbs");


// const path=require('path');
// app.use('/public',express.static(path.join(__dirname, 'public')));

app.set("view engine", "hbs");
app.set("views", "./views");
                                                // app.post("/signup",userRouter);
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 

                                                // router.use("/user", userRouter);
app.use("/api/v1/user", userRouter, (req, res) => {
    res.render("from");
});

app.use("/user", userRouter, (req, res) => {
});
                                                // app.userRouter("/", userRouter);
app.listen(3000,()=>{
    console.log("server is running on 3000");
});

 