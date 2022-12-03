// var minsToAdd = 180;
// let now = new Date().toLocaleTimeString();
// var newTime = now + minsToAdd * 6000;
// console.log(newTime);

// var minsToAdd = 180;
// var time = "15:00";
// let now = new Date().toLocaleTimeString('en-US',+minsToAdd);
// // var newTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
// // console.log(newTime);
// console.log(now);


var minsToAdd = 3;
var time = new Date().toLocaleTimeString();
var newTime = new Date(new Date("2000/01/01 " + time).getTime() + minsToAdd * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
console.log(newTime);