const express = require('express');
const app = express();
require('./db/dbconnection');
require("./admin/admin")
require("./StaticContaint/StaticContaint")
const userRouter = require("./routes/userRouter");
// const fileupload = require("express-fileupload");
const adminRouter = require('./routes/adminRouter');
const CronJob = require('cron').CronJob;

app.use(express.json({ limit: "50mb" }));

// app.use(fileupload({
//     useTempFiles: true
// }));
 

app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
                                              
app.use("/api/v1/user", userRouter, (req, res) => {
});

app.use("/user", userRouter, (req, res) => {
}); 

app.use("/admin", adminRouter, (req, res) => {
}); 

 
var job = new CronJob(
	'0 0 */3 * *',
	function() {
		console.log('You will see this message every second');
	},
	null,
	true,
	'America/Los_Angeles'
);


app.listen(3000,()=>{
    console.log("server is running on 3000");
});




// express, mongose, donenv, node-geocoder, cord(cross domian suport) 
// mapQuest API 


// backend...
/* node-geocoder provide.... { 
		1. lattitude..
		2. longitude...
		3. city....
		4. state code...
		5. zip code...
}
*/


/* frontend = {
	1. mapBox [ its free]  and we need to chouse the {
		1. web jshon
		2. apple
		3. android 

			{
				1. its provide NPM
				2. its provode CDN
			}
	}

}
*/