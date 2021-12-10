const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    proffession:{
        type: String,
        default : "Proffession"
    },
    phone:{
        type: String
    },
    dob:{
        type: String
    },
    gender:{
        type: String,
        enum: [ 'Male','Female']
    },
    fundsProvided:{
        type: Number,
        default : 1000000
    },
    fundsAvailable:{
        type: Number,
        default : 1000000
    },
    fundsUsed:{
        type: Number,
        default : 0
    },
    watchlist:{
        type: Array,
        properties: [{
            stockName :{
                type:String,
                unique:true,
            },
            stockSymbol :{
                type:String,
                unique:true,
            }
        }]
    },
    holdings:{
        type:Array,
        properties: [{
            stockSymbol:{
                type:String
            },
            qty:{
                type:Number
            },
            price:{
                type:Number
            }
            
        }]

    },
    transHistory:{
        type:Array,
        properties: [{
            stockName:{
                type:String
            },
            transType:{
                type:String
            },
            qty:{
                type:Number
            },
            price:{
                type:Number
            },
            created_at:{ 
                type: Date,
                default: () => Date.now(),
            }
            
        }]

    },
    reports:{
        type:Array,
        properties: [{
            stockName:{
                type:String
            },
            qty:{
                type:Number
            },
            buyPrice:{
                type:Number
            },
            sellPrice:{
                type:Number
            }
            
        }]

    },
    createdAt:{
        type:Date,
        default: () => Date.now(),
         immutable:true
    },
    updatedAt:{
        type:Date,
        default: () => Date.now(),
    },
},
{ timestamps: true })

module.exports = mongoose.model('User',userSchema )