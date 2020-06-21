var express     =   require('express');
var router      =   express.Router(); 

var campgrounds =   require("../models/campground");
var Comment     =   require("../models/comment");

var passport    =   require("passport");
var User        =   require("../models/user");


// Initial page ( root coute )
router.get("/",function(req,res)
{
    res.render("landing");
})

//======================================== Auth Routes starts ===============================================================

//show sign up form
router.get("/register",(req,res)=>
{
    res.render("register");
})

// handle signup logic
router.post("/register",(req,res)=>
{
    var username = req.body.username;
    var password = req.body.password;

    // User.register() will hash the password and save both hashing and username into database
    User.register(new User({username: username}), password,(err,user)=>
    {
        if(err)
        {
            console.log(err);
            req.flash("error",err.message);

            return res.render('register');
        }

        // below command will lock the user in and take care of everything in the session and run the 
        // serialize function defined in the app.js page
        // "local" -- > this is the strategy . You can change it to twitter,facebook or anything
        passport.authenticate("local")(req,res,()=>
        { 
            req.flash("success","Welcome to Yelpcamp" + user.username);
            res.redirect("/campgrounds");
        })
    })
})

// Login routes

// render login forms
router.get("/login",(req,res)=>
{
    res.render("login");
})

// Here passport.auhtenticate is used as a second argument before call back function
// Here it is used as a middleware ( means runs immediately when router.post is called )
// passport automatically takes the username and password from the form
// passport.authenticate() function is inbuilt and comes along with passport-local-mongoose

// login logic
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds" ,
    failureRedirect: "/login"
}),
(req,res)=>
{
    console.log(res);
}) 

// logout route
router.get("/logout",(req,res)=>
{
    // passport will destroy all the session informations related to this particular user
    req.logout();

    req.flash("success","Logged you out");

    res.redirect("/campgrounds");
})

// // you can give any name to a function ( middleware )
// function isLoggedIn(req, res, next)
// {
//     // next as a parameter will run the call back function which will render the secret page
    
//     if(req.isAuthenticated())
//     return next();

//     req.flash("error","Please Login in");
//     res.redirect("/login");
// }

//========================================== Auth ends======================================================================

module.exports = router;