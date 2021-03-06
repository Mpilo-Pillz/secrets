//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const md5 = require('md5');
// const encrypt = require('mongoose-encryption');
const ejs = require('ejs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secrit = "Thisisourlittlesicrits.";
// userSchema.plugin(encrypt, { secret: secrit, encryptedFields: ["password"] });
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.route("/login")
    .get(function(req, res){
        res.render("login");
})
    .post(function(req, res){
        const username = req.body.username;
        const password = req.body.password;
        // const password = md5(req.body.password);

        User.findOne({email: username}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if (foundUser) {

                        bcrypt.compare(password, foundUser.password, function(err, result) {
                            if(result === true){
                                res.render("secrets");
                            }
                        });
                    } else {
                        console.log("Invalid User");
                         res.send("invalid user");
                        // res.render("login");
                }
            }
        })
    });

app.route("/register")
    .get(function(req, res){
        res.render("register");
})
    .post(function(req, res){

        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
                // password: md5(req.body.password)
     });
    
        newUser.save(function(err){
            if (err) {
                console.log(err); 
            } else {
                res.render("secrets");
            }
        });
        });
          });

app.listen(3000, function(){
    console.log("Secrets app started on port 3000");
});

// User.findOne({email: username}, function(err, foundUser){
//     if(err){
//         console.log(err);
//     } else {
//         if (foundUser) {
//             if (foundUser.password === password) {
//                 res.render("secrets");
//             } 
//             } else {
//                 console.log("Invalid User");
//                  res.send("invalid user");
//                 // res.render("login");
//         }
//     }
// })




