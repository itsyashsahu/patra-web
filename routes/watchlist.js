var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
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
  
router.get('/check',requireLogin,(req,res)=>{ // this is protected resource user can access this only if he has headers i.e. token 
res.json({message: req.user })
})

  


// getting user watchlists form database 
var watchlists ;
router.get('/',requireLogin, async function (req, res, next){
    // var id = req.body.userId;
    var id = req.user;
    console.log(req.user);
    try{
        // console.log(id);
        // console.log(id);
        const user = await User.findById({"_id": id },{watchlist:1,_id:0})
        .then( (res)=>{
            // console.log("this is result",res.watchlist);
            return res.watchlist
        })
        .catch( (err)=>{
            console.log(err);
        })
        // console.log(user);
        watchlists = user;
        res.send(user);

    }catch(err){
        console.log(err);
    }
    // console.log("this is the watchlist",watchlists)
});

// saved the previous for safety purpose
// var watchlists ;
// router.post('/', async function (req, res, next){
//     var id = req.body.userId;
//     // console.log(req.body);
//     try{
//         // console.log(id);
//         // console.log(id);
//         const user = await User.findById({"_id": id },{watchlist:1,_id:0})
//         .then( (res)=>{
//             // console.log("this is result",res.watchlist);
//             return res.watchlist
//         })
//         .catch( (err)=>{
//             console.log(err);
//         })
//         // console.log(user);
//         watchlists = user;
//         res.send(user);

//     }catch(err){
//         console.log(err);
//     }
//     // console.log("this is the watchlist",watchlists)
// });


// Adding watclist to the database 
router.post('/add',requireLogin, async function (req, res, next){
    // var id = req.body.userId;
    var id = req.user;
    var stockName = req.body.stockName;
    var stockSymbol = req.body.stockSymbol;

    // console.log("this is the request body",req.body);
    try{
        // console.log(id);
        // console.log(id);
        // const userWatchlist = await User.findOne({"_id": id })


        if( !stockName || !stockSymbol )
        {
            return res.status(422).json({error:"Please add All the fields"});
        }else{
            
            const user = await User.updateOne(
                {"_id": id },
                { $addToSet : { watchlist : {
                    stockName,
                    stockSymbol
                }
                } 
            }).then((res)=>{
                // console.log("adding stock to wathclist result",res)
                return res;
            })
            return res.send(user); 
        }
        // console.log(user);
    }catch(err){
        console.log(err);
        res.send(err);
    }

});

// dummy data for adding 
// {
//     "userId":"",
//     "stockName":"Tata Global Beverages Limited",
//     "stockSymbol":"TATACONSUM.BSE"
// }



// this is firing two queryies to update the watchlists

// router.post('/add', async function (req, res, next){
//     var id = req.body.userId;
//     var stockName = req.body.stockName;
//     var stockSymbol = req.body.stockSymbol;

//     console.log(req.body);
//     try{
//         console.log(id);
//         // console.log(id);
//         const userWatchlist = await User.findById({"_id": id })
//         const user = await User.findByIdAndUpdate(
//             {"_id": id },
//             {"watchlist":[ 
//                         ...userWatchlist.watchlist,    
//                         {    
//                             "stockName": stockName,
//                             "stockSymbol":stockSymbol
//                         } 
//                     ]
//             } )
//         console.log(user.watchlist);
        
//         res.send("ok");

//     }catch(err){
//         console.log(err);
//     }

// });


//to delete a entry in watchlist
router.post('/remove',requireLogin, async function (req, res, next){
    // var id = req.body.userId;
    var id = req.user;
    var stockSymbol = req.body.stockSymbol;
    // console.log("this is the request body",req.body);
    try{
        if(!stockSymbol )
        {
            return res.status(422).json({error:"Please add All the fields"});
        }else{
            
            const user = await User.updateOne(
                {"_id": id },
                { $pull : { watchlist : {stockSymbol:stockSymbol} } }
            ).then((res)=>{
                // console.log("removing stock from wathclist result",res)
                return res;
            }).catch((err)=>console.log(err))
            return res.send(user); 
        }
        // console.log(user);
    }catch(err){
        console.log(err);
        res.send(err);
    }


    // console.log("this is the watchlist",watchlists)
});


module.exports = router;
