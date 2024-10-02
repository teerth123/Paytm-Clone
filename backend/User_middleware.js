const zod = require("zod");
const {User} = require("./db");
const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");
const user_schema = zod.object({
    firstName:zod.string().min(4),
    lastName:zod.string(),
    password:zod.string().min(6).max(16),
    
})

const optional_change = zod.object({
    firstName : zod.string().optional(),
    lastName:zod.string().optional(),
    password:zod.string().optional()
})

async function parser(req, res, next){
    const {firstName, lastName, password} = req.body;
    
    const result = user_schema.safeParse({firstName, lastName, password});
    if(!result.success) res.json({
        "msg":"invalid credentials"
    })
    else next();
    
}

async function change(req, res, next){
    const {firstName, lastName, password} = req.body;
    const {firstNameChange, lastNameChange, passwordChange} = req.body;

    const result = user_schema.safeParse({firstName, lastName, password});
    const result2 = optional_change.safeParse({firstName:firstNameChange, lastName:lastNameChange, password:passwordChange});
    if(!result2.success){
        res.json({
            "msg":"err with changed credentials"
        })
    } else{
        next();
    }
}

function authMiddleware(req, res, next){
    const auth = req.headers.authorization || req.headers.Authorization;
    if(!auth || !auth.startsWith('Bearer ')){
        return res.json({
            "msg":"incorrect token"
        })
    }
    else{
        try{
            const token = auth.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            if(decoded.userId){
                req.userId = decoded.userId;
                next();
            } else{
                return res.status(403).json({
                    "msg":"first"
                })
            }
            
        }catch{
            return res.status(403).json({
                "msg":"sec"
            })
        }
        
    }

    
}
module.exports = {parser, change, authMiddleware}