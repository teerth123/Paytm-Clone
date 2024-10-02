const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const { User, Account } = require("../db");
const {parser, change, authMiddleware} = require("../User_middleware")

userRouter.post("/sign-up", parser, async(req, res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    const existing = await User.findOne({firstName, lastName});
    if(existing){
        res.json({
            "msg":"already exists, sign-in"
        })
    }else{
        const new_user = await User.create({
            firstName,  
            lastName,
            password
        })
        await Account.create({
            userId:new_user._id ,
            balance:Math.random()*10000 
         })
         const userId = new_user._id
        const token = jwt.sign({ userId  }, JWT_SECRET, { expiresIn: "1d" });
        res.json({
            "msg":"user created, sign-in now",
            token
        })
    }
    
    
})

userRouter.post("/sign-in", parser, async(req, res)=>{
    const {firstName, lastName, password} = req.body;
    const existing = await User.findOne({firstName, lastName, password});
    const userId = existing._id 
    if(existing) {
        const token = jwt.sign({userId},JWT_SECRET, {expiresIn:'1d'});
            res.json({
                "msg":"signed in",
                token
            })
    }else{
        res.json({
            "msg":"no user found, sign-up first"
        })
    }
})

userRouter.put("/update", authMiddleware, async(req, res)=>{
    const {firstName, lastName, password} = req.body;
    const {firstNameChange, lastNameChange, passwordChange} = req.body;
    try{
        const user = await User.findOneAndUpdate({firstName, lastName, password}, {firstName:firstNameChange, lastName:lastNameChange, password:passwordChange});
        // return res.json({
        //     "msg":"updated successfully"
        // })
        if(!user){
            return res.status(404).json({
                "msg": "User not found"
            });
        }
        return res.json({
            "msg": "Updated successfully",
            user
        });
    }
    catch{
        return res.json({
            "msg":"no user found"
        })
    }
})

userRouter.get("/bulk", async (req, res) => {
    const { filter } = req.query; 
    
    let query = {}; 

    if (filter) {
        query = {
            $or:[
                {firstName : { "$regex": filter, "$options": "i" }}, // Case-insensitive regex match
                {lastName : {"$regex" : filter, "$options":"i"}}
            ] 
        }   
    }

    try {
        const all_users = await User.find(query); // Only filter based on provided parameters
        res.json({
            user: all_users.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (e) {
        e
    }
});


module.exports = {userRouter}
