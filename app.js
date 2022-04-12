//jshint esversion:6
require('dotenv').config(); //As early as possible in your application, import and configure dotenv:
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({
  extended: true
}));

//use mongoose to connect to mongoDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//set up new user database
//1st create a schema

 //userschema with javascript object
 const userSchema = new mongoose.Schema ({
   email: String,
   password: String
 });

//encryption code

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); //the plugin must be added to the schema before the mongoose model is created because we are passing in the userschema as a parameter  to create the new mongoose model


 //use user schema to set up a new user model
 const User = new mongoose.model("User", userSchema) //<--User=name of collection and collection being created using userSchema


//targeting home/root route
app.get("/", function(req, res){
  res.render("home"); //home.ejs
});

//targeting login route
app.get("/", function(req, res){
  res.render("home"); //login.ejs
});

//targeting register route
app.get("/register", function(req, res){
  res.render("register"); //register.ejs
});

//targeting login route
app.get("/login", function(req, res){
  res.render("login"); //login.ejs
});

//at this point there is no app.get for the secrets route because it sholdnt be rendered unless the user is already registered or logged in

//to capture new users that register
app.post("/register", function(req,res){ //call back
const newUser = new User ({//the new user-being created from the info submitted in the register form
  email: req.body.username, //username coming from the name assigned to the email input on the register page
  password: req.body.password //passwoerd coming from the name assigned to the password input on the register page
});
newUser.save(function(err){ //save the new registered user, if any errors log and if not render the secrets page
   if (err){
        console.log(err);
   }else{
     res.render("secrets");
   }
});
});

//login access
app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password

  //check if there is a user with the entered credentials
  User.findOne({email: username},function(err, foundUser){ //username comes from the user trying to login and the email field comes from the database that has the saved data.//look through our User collection to see if there is a user whose email field matches the username field
  if(err){
    console.log(err);
  }else{
     if(foundUser){//if there was a user in the database with that email then check to see if their password macthes the password that was typed on the login page
       if(foundUser.password === password) {//if it matches then they are the correct user andthey are authenticated and the pge can be rendered
          res.render("secrets")
       }

  }}
});

});



app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
