const StaticContaint = require("../model/StaticContaint")


var StaticData = {
    type: "privacy",
    discription: "abcd........cdef......efgh.....",
    title : "privacy and policy"
}

StaticContaint.findOne({title : "privacy and policy"},(err, result)=> {
    if(result){
        console.log("Static Containt is already added.....!!!");
    }
    else {
        StaticContaint.create(StaticData, function(e) {
            if (e) {
                throw e;
            }
            else {
                console.log("Static Containt added.....!!!");
            }
        });
    }
})




// db.orders.aggregate( [
//     ... {
//     ...    $match : { siza : "medium" }
//     ... },
//     ... 
//     ... {
//     ...   $group : { _id : "$ISODate", totalQuantity : { $sum : "$quantity" } }
//     ... }
//     ... ] )
    