const express = require("express");
const request = require("request");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/home.html");
})

app.post("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
})

// app.post("/sign-up",function(req,res)
// {
//     res.redirect("/");
// })

app.post("/mild",function(req,res)
{
    res.sendFile(__dirname+"/mild.html");
})

app.post("/moderate",function(req,res)
{
    res.sendFile(__dirname+"/moderate.html");
})

app.post("/severe",function(req,res)
{
    res.sendFile(__dirname+"/severesym.html");
})

app.post("/navHome",function(req,res)
{
    res.redirect("/");
})

app.listen(3000,function()
{
    console.log("Server is running on port 3000");
})

// db

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign-up",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "name": name,
        "email" : email,
        "password" : password
    }

   

    // nodemailer
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
}));

var mailOptions = {
  from: 'durgeshnandinidscs@gmail.com',
  to: data.email ,
  subject: 'Remainder email From CoAstra',
  text : `I am Durgesh Nandini from the CoAstra community. This is a reminder email being sent to you from CoAstra.

  Please head back to our website and  check out all the suggestions and remedies suggested and please adhere to them. Refer to our exercises section and practice all the respective exercises regularly. Head over to the essential link sections and avail all the essential services from the best online providers.
  
  We strive for your speedy recovery, hope you get well soon.
  
  Regards, Team CoAstra.`     
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  

db.collection('user').insertOne(data,(err,collection)=>{
    if(err){
        throw err;
    }
    console.log("Record Inserted Successfully");
});

return res.redirect('/');

})
 
