var express = require('express');
var router = express.Router();
const User = require('../db/userSchema');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;



//middle to check if the user is logged in or not
const requireLogin = (req,res,next) => {

    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"You must be logged In "});
    }
    try{
        const { userId } = jwt.verify(authorization,JWT_SECRET)
        req.user = userId;
        next()
    }catch(err){
        return res.status(401).json({error:"You must be logged In Understand"});
    }
}


// get transHistory data from dataBase 
router.get('/',requireLogin, async function(req, res, next) {
    // var id = req.body.userId;
    var id = req.user;
    // console.log("request for transHistory",id);
    try{
        const user = await User.findById({"_id": id },{transHistory:1,_id:0})
        .then( (res)=>{
            // console.log("result of transhistory",res);
            return res.transHistory
        })
        res.send(user);
    }catch(err){
        console.log(err);
    }
});
// router.post('/', async function(req, res, next) {
//     var id = req.body.userId;
//     console.log("request for transHistory",id);
//     try{
//         const user = await User.findById({"_id": id },{transHistory:1,_id:0})
//         .then( (res)=>{
//             return res.transHistory
//         })
//         // console.log(user);
//         res.send(user);
//     }catch(err){
//         console.log(err);
//     }
// });

module.exports = router;
