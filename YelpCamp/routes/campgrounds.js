var express     =  require('express');
var router      =  express.Router(); 

var Campground  =  require("../models/campground");
var Comment     =  require("../models/comment");

//  "../middleware/index" --> don't require the index file as it will be automatically required
// due to it's name "index.js". That's why we name the file "index.js" and not "middleware.js"
var middleware  =  require("../middleware/index");


//index --- show all campgrounds
router.get("/campgrounds",function(req,res)
{
    // res.render("campgrounds",{camp:campgrounds});
    // console.log(req.user._id);
    Campground.find({},function(err,allCampgrounds)
    {
        if(err)
        console.log("Error");
        else
        res.render("campgrounds/index",{campground: allCampgrounds});
    });
});

// new --- show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res)
{
    res.render("campgrounds/new");
});

//create --- add new campground to database
router.post("/campgrounds", middleware.isLoggedIn, function(req,res)
{
    // extracting datas from name attributes since post request

    var name=req.body.campground.name;
    var price=req.body.campground.price;
    var image=req.body.campground.image;
    var desc=req.body.campground.description;

    console.log(name);
    
    var author = 
    {
        id: req.user._id ,
        username: req.user.username
    }

    var newCampground = 
    { 
        name: name ,
        price: price , 
        image: image , 
        description: desc ,
        author: author
    }

    Campground.create(newCampground, function(err,newly)
    {
        if(err)
        console.log("Error");
        else
        res.redirect("/campgrounds");
    });
});

// This must be written after app.get("/campgrounds/new..) otherwsie if we want to 
// open  "/campgrounds/new" we end by opening the "/campgrounds/:id"

// Show --- shows more info about campground
router.get("/campgrounds/:id",function(req,res)
{
    var id=req.params.id;

    Campground.findById(id).populate("comments").exec(function(err,foundCampground)
    {
        if(err)
        console.log(err);
        else
        {
            // console.log("Found Campground");
            // console.log(foundCampground.comments);
            res.render("campgrounds/show",{data: foundCampground});
        }
    });
});

//Edit route
router.get("/campgrounds/:id/edit", middleware.checkCampOwner, function(req,res)
{
    var id = req.params.id;

    Campground.findById(id,function(err,foundCampground)
    {
        if(err)
        console.log(err);
        else
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});

//update campground route
router.put("/campgrounds/:id", middleware.checkCampOwner, function(req,res)
{
    var id = req.params.id;
    var data = req.body.campground;

    Campground.findByIdAndUpdate(id,data,function(err,updatedCampground)
    {
        if(err)
        res.redirect("/campgrounds");
        else
        res.redirect("/campgrounds/"+id);

        // id can also be achieved throuhgh updatedCampground._id
    });
});

//destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampOwner, function(req,res)
{
    var id = req.params.id;

    Campground.findByIdAndRemove(id,function(err)
    {
        if(err)
        res.redirect("/campgrounds");
        else
        res.redirect("/campgrounds");
    });
});

// // you can give any name to a function ( middleware )
// function isLoggedIn(req, res, next)
// {
//     // next as a parameter will run the call back function which will render the secret page
    
//     if(req.isAuthenticated())
//     return next();

//     res.redirect("/login");
// }

// // check who owns the campground
// function checkCampOwner(req, res, next)
// {
//     if(req.isAuthenticated())
//     {
//         var id = req.params.id;

//         Campground.findById(id,function(err,foundCampground)
//         {
//             if(err)
//             res.redirect("back");
//             else
//             {
//                 var foundId = foundCampground.author.id;
//                 var loggedinId = req.user._id; 
                
//                 if(foundId.equals(loggedinId))
//                 next();
//                 else
//                 res.redirect("back");
//             }
//         });
//     }
//     else
//     res.redirect("back");

//     //back means to previous page
// }

module.exports = router;