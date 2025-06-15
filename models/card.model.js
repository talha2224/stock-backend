const mongoose = require("mongoose")



const CardSchema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Account"},
    name:{type:String,required:true},
    cardNumber:{type:String,required:true},
    month:{type:String,required:true},
    year:{type:String,required:true},
    expiry:{type:String,required:true},
    cvv:{type:String,required:true},
})



const Card = mongoose.model("Card",CardSchema,"Card")


module.exports ={ Card }