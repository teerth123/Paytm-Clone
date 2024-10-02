const mongoose = require("mongoose");
const { mongoURL } = require("./config");
const {Schema} = mongoose;
try{
    mongoose.connect(mongoURL)
    .then(()=>{
        console.log("connnected to db")
    })
}catch(e){
    console.log(e);
}

const user_schema = new Schema({
    firstName:String,
    lastName:String,
    password:String
})
const User = mongoose.model('User', user_schema);

const account_schema = new Schema({
    userId:{type: Schema.Types.ObjectId, ref:"User"} ,
	balance:Number
})
const Account = mongoose.model('Account', account_schema);

module.exports = {User, Account}