const {Schema,model, SchemaTypeOptions} = require('mongoose')

const UserStatic = new Schema({
    Domain : {
        type : String
    },
    Secction:{
        type:String
    },
    Lebel:{
        type:Number
    },
},{timestamps: true})

module.exports = model('UserStatic',UserStatic)
