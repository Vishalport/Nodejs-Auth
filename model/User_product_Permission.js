const {Schema,model, SchemaTypeOptions, default: mongoose} = require('mongoose')
// const {Schema,model, SchemaTypeOptions} = require('mongoose') 
const product_permission = new Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    permission:{
        type:String
    },
},{timestamps: true})

module.exports = model('product_permission',product_permission)
