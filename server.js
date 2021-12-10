const express = require('express')
const app = express()
var cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 4000
app.use(express.json())
app.use(cors());


// app.use(require('./routes/auth'))
// app.use(require('./routes/post'))
// app.use(require('./routes/user'))

require('./db/connfig');

app.use( "/"  , require( './routes/index') )
app.use( "/users"   , require( './routes/users') )
app.use( "/report"   , require( './routes/report') )
app.use( "/holding"   , require( './routes/holding') )
app.use( "/watchlist"   , require( './routes/watchlist') )
app.use( "/transhistory"   , require( './routes/transHistory') )


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})

