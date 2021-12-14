const mongoose = require("mongoose");
require('dotenv').config();

const connectString = process.env.SECRET_KEY;

mongoose.connect(connectString,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    autoIndex:true,
    // useFindAndModify:true,
    // useCreateIndex:true,
    family:4,

}).then( ()=>{
    console.log(`connection is succesfull`);
}).catch( (e) =>{
    console.log(e);
})