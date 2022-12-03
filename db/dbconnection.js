const mongoose =require('mongoose')

mongoose.connect("mongodb://localhost:27017/testdb",{useUnifiedTopology:true},(err,res)=>{
    if(err){
        console.log('connection error',err);
    }
    else{
        console.log("db connected");
    }
})