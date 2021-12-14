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

// getting user holdings form database 
// var holdings ;
router.get('/', requireLogin,async function (req, res, next){
    var id = req.user;
    try{
        const user = await User.findById({"_id": id },{holdings:1,_id:0})
        .then( (res)=>{
            return res.holdings
        })
        .catch( (err)=>{
            console.log(err);
        })
        res.send(user);

    }catch(err){
        console.log(err);
    }
});


router.post('/trans',requireLogin, async function(req, res, next) {
    const dataRecieved = req.body;
    var id = req.user;
    var { stockSymbol,stockName,qty,price,option} = req.body;
    console.log(req.body)

    try{

        if( !stockSymbol || !qty || !price || !option )
        {
            return res.status(422).json({error:"Please add All the fields"});
        }else{
            // means user has send a valid request

            // query to add entry to the transHistory
            const quantity = Number( (+qty) ) ;
            const transType = (option==='buy')?"Bought":"Sold";
            const transEntryResult = await User.updateOne(
                {"_id": id },
                { 
                    $push : { "transHistory" : {
                    "transType":transType,
                    "qty":quantity,
                    "transPrice":price,
                    stockName,
                    "purchased_at": new Date()
                }
                } 
            }).then((res)=>{
                return res;
            }).catch((err)=>console.log(err))
            console.log(transEntryResult);

            
            // finding if user already has the stock 
            // if it has the isStock contains the stock else it is undefined
            // this is useful for both type of transaction

            const isStock = await User.findOne( {"_id":id} )
            .then(res =>{
                const stock = res.holdings.find( (stock,index)=>{
                    if(stock.stockSymbol===stockSymbol){
                        return stock
                    }
                })
                return stock;
            })
            .catch(err => console.log(err));

            // if user wants to buy the stock then 
            if(option==='buy'){
                                
                // means user is adding more stocks to a already holded stock 
                if(isStock){
                    const stockData = isStock;

                    // if we want to change the buyPrice during entry change it here
                    // price = 700;

                    // calculating the avg Price 
                    var avgPrice = ( (stockData.qty*stockData.price)+(qty*price) ) / ( (+stockData.qty) + (+qty) ) ;

                    //rounding the price to 2 decimal 
                    avgPrice = Math.round( ( avgPrice) * 100) / 100;

                    // changeing the quatitiy to number and Increacing it 
                    const quantity = Number( ((+stockData.qty) + (+qty)) ) ;

                    // query to update the stock holding fields for that particular stock 
                    const result = await User.updateOne(
                        {"_id":id,"holdings.stockSymbol":stockSymbol},
                        {
                            $inc : {
                                "fundsAvailable": -(price*(+qty))
                            },
                            $set:{
                                "holdings.$":{
                                    "stockSymbol":stockSymbol,
                                    "qty": quantity ,
                                    "price": avgPrice,
                                    "stockName": stockName
                                },
                                
                            }
                        }
                    ).then((res)=>{
                        return res;
                    }).catch((err)=>console.log(err));
                    
                    return res.send(result); 
                    

                }else{
                    //when user is buying a new stock to his portfolio

                    // changing the DataType of qty variable to Number 
                    const quantity = Number( (+qty) ) ;
                    console.log(price*quantity);
                    // query to add entry to the holdings 
                    const user = await User.updateOne(
                        {"_id": id },
                        { 
                            $inc : {
                                "fundsAvailable": -(Math.round( (price*quantity) * 100) / 100)
                            },
                            $addToSet : { holdings : {
                            stockSymbol,
                            "qty":quantity,
                            price,
                            stockName
                            },
                        } 
                    }).then((res)=>{
                        return res;
                    }).catch((err)=>console.log(err))
                    return res.send(user); 

                }

            }else if(option==='sell'){
                // if user wants to sell the stock then 

                const stockData = isStock;
                // price = 700;


                if(stockData.qty<qty){
                    // user cannot execute the transaction 
                    // since he does hold the stocks 
                }else if(stockData.qty == qty){
                    //if user is selling all the stocks then we need to remove the stock entry 

                    //if user is squaring off the generate a report for this 
                    const quantity = Number( (+qty) ) ;
                    const reportEntryResult = await User.updateOne(
                        {"_id": id },
                        {
                            $push : { "reports" : {
                            stockName,
                            "qty":quantity,
                            "buyPrice":stockData.price,
                            "sellPrice":price,
                        }
                        } 
                    }).then((res)=>{
                        return res;
                    }).catch((err)=>console.log(err))


                    // query to remove the stock entry 
                    const user = await User.updateOne(
                        {"_id": id },
                        { 
                            $inc : {
                                "fundsAvailable": (price*quantity)
                            },
                            $pull : { holdings : {stockSymbol:stockSymbol} } }
                    ).then((res)=>{
                        return res;
                    }).catch((err)=>console.log(err))

                    return res.send(user); 

                }else{
                    // if user is decreasing the stocks hold by him 

                    // query to only update the qty field of that stock 
                    console.log("sold the stock ")
                    const qtyLeft = stockData.qty-qty;
                    const user = await User.updateOne(
                        {"_id":id, holdings:{ $elemMatch:{"stockSymbol":stockSymbol} } },
                        { 
                            $inc : {
                                "fundsAvailable": (price*(+qty))
                            },
                            $set : { "holdings.$.qty" : qtyLeft }
                        }
                    ).then((res)=>{
                        console.log("removing stock from selling stock some quantiy result",res)
                        return res;
                    }).catch((err)=>console.log(err))
                    return res.send(user); 

                }
            }

        }
    }catch(err){
        console.log(err);
        res.send(err);
    }

});

module.exports = router;
