var express             =       require("express");
var app                 =       express();
var bodyParser          =       require("body-parser");
var request             =       require('request');
var flash               =       require("connect-flash");

var MongoClient         =       require('mongodb').MongoClient;
var mongoose            =       require("mongoose");

var seedDB              =       require("./seeds");
var Campground          =       require("./models/campground");
var Comment             =       require("./models/comment");

var passport            =       require("passport");
var LocalStrategy       =       require("passport-local");
var pssprtMong          =       require("passport-local-mongoose");
var session             =       require("express-session");
var User                =       require("./models/user");
var methodOverride      =       require("method-override");

var commentRoutes       =       require("./routes/comments");
var campgroundRoutes    =       require("./routes/campgrounds");
var indexRoutes         =       require("./routes/index");

const port              =       process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost:27017/yelp_camp");
mongoose.connect("")
.then(() => 
{
    console.log("Connected to Database");
})
.catch((error) => 
{
    console.log("Not Connected to Database ERROR! ", error);
});

// will remove all the campgrounds whenever we start the server
// seedDB();

//To use body-parser package
app.use(bodyParser.urlencoded({extended: true}));

//To tell express to search for the public directory expicitly for style.css file
// app.use(express.static('public'));

// __dirname means directory of file "app.js"
app.use(express.static(__dirname+'/public'));

//To tell express that the extension is ejs
app.set("view engine","ejs");
const ejsLint = require('ejs-lint');

app.use(methodOverride("_method"));
app.use(flash());

//************************************************************  Passport  *********************************************************************

// npm install passport passport-local passport-local-mongoose express-session --save

app.use(session(
{
    secret: "Emilia is love of my life" ,
    resave: false ,
    saveUninitialized: false
}));
    
app.use(passport.initialize());
app.use(passport.session());

// These functions are responsible for reading the session and taking the data from the session as encoded
// and unecoding it (deserialize) and encoding it (serialize) and putting it back to session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// creating the LocalStrategy using User.auhtenticate method coming from passport local mongoose  
passport.use(new LocalStrategy(User.authenticate()));

    
//************************************************************************************************************************************************

// To pass currentUser variable to every routes
//To pass flash messages (error and success to all pages)
app.use((req, res, next)=>
{
    // will pass req.user to every single template
    res.locals.currentUser = req.user;

    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    
    // To proceed to next step after this middleware gets over
    // If we don't write next() nothing will happen next and it will stop
    next();
})

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

// while using ()=> for function in ea6 don't put semicolon at the end of this function
app.listen(port ,function()
{
    console.log("server is running on port : ",port);
});
