const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken")
const {User, Account} = require("../db");
const { authMiddleware } = require("../User_middleware");
const { mongoose } = require("mongoose");
const accountRouter = require("express").Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const account = await Account.findOne({ userId: userId });

    if (!account) {
        return res.status(404).json({ error: "Account not found" });
    }

    return res.json({
        balance: account.balance
    });
});

accountRouter.put("/transfer",authMiddleware, async (req, res)=>{
    const senderId = req.userId;
    const sender = await User.findOne({_id:senderId});
    const {to, amount} = req.body;   // to  - is the _id of the user

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        if(!to){
            return res.status(400).json({error:"invalid user"});
        }else {
            if(amount>sender.balance) return res.status(400).json({error:"insuffecient balance"})
            else{
                await Account.findOneAndUpdate(
                    { userId: senderId },
                    { $inc: { balance: -amount } },
                    { new: true }
                );
        
                // Update receiver's balance
                await Account.findOneAndUpdate(
                    { userId: to },
                    { $inc: { balance: amount } },
                    { new: true }
                );
                await session.commitTransaction();
                return res.status(200).json({"msg":"transaction successful"})
            } 
        }
    }catch(e){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({"msg":"rolled back" , e})
    }
})

module.exports = {accountRouter}