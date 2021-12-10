var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
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


router.get('/getinfo',requireLogin, async function(req, res, next) {
  var id = req.user;

  try{
    const user = await User.findById({"_id": id },{name:1,_id:0,fundsAvailable:1,proffession:1})
        .then( (res)=>{
            console.log("this is result of get userData",res);
            return res
        })
        .catch( (err) =>{
          console.log(err);

        })
        res.send(user);

  }catch(err){
    console.log(err)
  }
});
// router.post('/getinfo', async function(req, res, next) {
//   var id = req.body.userId;

//   try{
//     const user = await User.findById({"_id": id },{name:1,_id:0,fundsAvailable:1,proffession:1})
//         .then( (res)=>{
//             console.log("this is result of get userData",res);
//             return res
//         })
//         .catch( (err) =>{
//           console.log(err);

//         })
//         res.send(user);

//   }catch(err){
//     console.log(err)
//   }
//   // res.send('respond with a resource');
// });



router.post('/updateinfo',requireLogin, async function(req, res, next) {
  // var id = req.body.userId;
  var id = req.user;
  var name = req.body.name;
  var proffession = req.body.proffession;
  var dob = req.body.dob;
  var phone = req.body.phone;
  var gender = req.body.gender;
  var inputs = req.body;

  try{
    const userInfo = await User.findById({"_id": id },{name:1,_id:0,phone:1,proffession:1,gender:1,dob:1})
        .then( (res)=>{
            console.log("this is result of get find edit user data",res);
            return res
        })
        .catch( (err) =>{
          console.log(err);

        })

      console.log("userInfo h yeh ",userInfo)
      var { name , proffession , dob , phone , gender } = userInfo ;
      console.log(name,proffession,dob,phone,gender );
      // runned this multiple if statements to ensure user can update a single field as well
      if(inputs.name){ name = inputs.name}
      if(inputs.proffession){ proffession = inputs.proffession}
      if(inputs.dob){ dob = inputs.dob}
      if(inputs.phone){ phone = inputs.phone}
      console.log(name,proffession,dob,phone,gender );



    const user = await User.updateOne({"_id": id },
              {
                $set :{
                  dob,
                  phone,
                  name,
                  proffession,
                  gender
                }
              },
              { upsert : true }
              )
        .then( (res)=>{
            console.log("this is result of Update userData",res,req.body);
            return res
        })
        .catch( (err) =>{
          console.log(err);

        })
        res.send(user);

  }catch(err){
    console.log(err)
  }
  // res.send('respond with a resource');
});



router.get('/check',requireLogin,(req,res)=>{ // this is protected resource user can access this only if he has headers i.e. token 
  res.json({message: req.user })
})

//signup request 
router.post('/', async function(req, res, next) {
  try{
    
    const { name,email,password } = req.body;
    // console.log(req.body);
    // console.log(name,email,password);
    if(!email || !password ){
      // status 422 means client jo karna chahta h wo server samajh gaya h 
      // but for some reasons server wo process nhi kr skta like password glt h etc 
      // we use return because uske baad baki ka codee execute nhi hona chahiye

      return res.status(422).json({error:"Please add All the fields"});
    } 
    const user = await User.findOne({email:email});
    //agar user mil jata h means wo already database mein h toh error denge
    if(user){
      // made a coustom error status 424 which signifies that user already exsits
      return res.status(424).json({error:"user already exits"})
    }

    const hashedPass = await bcrypt.hash(password,12);
    new User({
      email:email,
      password:hashedPass,
      name:name
    }).save()

    res.status(200).json({message:"You Can Login Now "});
  }catch(err){
    console.log(err);
  }
});


// dummy data for signup
// {
//   "name":"jesica",
//   "email":"jesi@gmail.com",
//   "password":"asdf"
// }

//signIn Request 
router.post('/signin', async function(req, res, next) {
  
  try{
    
    const { email,password } = req.body;
    if(!email || !password ){
      // status 422 means client jo karna chahta h wo server samajh gaya h 
      // but for some reasons server wo process nhi kr skta like password glt h etc 
      // we use return because uske baad baki ka codee execute nhi hona chahiye

      // yeh 422 hona chahiyr mene isse 4220 bana diya h taki mein apne code mein ise use kr sako 
      return res.status(4220).json({error:"Please add All the fields"});
    } 
    const user = await User.findOne({email:email});
    //agar user nhi milta h means usko signup krna chahiye h toh error denge
    if(!user){
      return res.status(422).json({error:"user does not exits"})
    }
    const doMatch = bcrypt.compareSync(password,user.password);

    if(doMatch){
      // generating jwt token 
      console.log("do match is true",user.name)
      const token = await jwt.sign({userId:user._id},JWT_SECRET);
      return res.status(201).json({token});
    }else{
      return res.status(401).json({error:"Email or Password is Invalid"});   
    }

  }catch(err){
    console.log(err);
  }
});

module.exports = router;
