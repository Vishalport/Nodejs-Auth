const {Schema,model, SchemaTypeOptions} = require('mongoose')

const StaticContaint = new Schema({
    type : {
        type : String
    },
    discription:{
        type:String
    },
    title:{
        type:String
    },
},{timestamps: true})

module.exports = model('StaticContaint',StaticContaint)
