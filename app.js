const express = require('express');
var path = require('path');
const app = express();
const flash = require('connect-flash');
const passport = require('passport');

const mongoose = require('mongoose');
const User = require('./models/user.js');
var url = "mongodb+srv://user:1234@cluster0.flpmu.mongodb.net/assignment";
var bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));


require('./passport-config')(passport)

//db connect
mongoose.connect(url, {useNewUrlParser: true}).then((db) => {
    console.log('db connected')


}).catch((err) => console.log(err));
app.listen(process.env.PORT || 3000);

app.set("view engine", "ejs");


//session initialize

app.use(require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
//passport initalize
app.use(passport.initialize());
app.use(passport.session())

app.use(flash())
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes
app.use('/', require('./routes/routes.js'));
//app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
