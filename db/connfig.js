const mongoose = require("mongoose");
require('dotenv').config();

const connectString = process.env.SECRET_KEY;
// const connectString = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

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