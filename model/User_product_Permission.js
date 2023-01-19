const {Schema,model, SchemaTypeOptions, default: mongoose} = require('mongoose')

const product_permission = new Schema({
    user_ID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    permission:{
        type:String
    },
},{timestamps: true})

module.exports = model('product_permission',product_permission)
