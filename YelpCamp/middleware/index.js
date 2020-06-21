var Campground  =  require("../models/campground");
var Comment     =  require("../models/comment");

// All the middleware goes here

//defining middlewareObj as an object
var middlewareObj = {};

// check who owns the campground
middlewareObj.checkCampOwner = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        var id = req.params.id;

        Campground.findById(id,function(err,foundCampground)
        {
            if(err)
            {
                // in flash() function , first parameter is key and second one is value
                req.flash("error","Campground not found !");
                
                res.redirect("back");
            }
            else
            {
                var foundId = foundCampground.author.id;
                var loggedinId = req.user._id; 
                
                if(foundId.equals(loggedinId))
                next();
                else
                {
                    // in flash() function , first parameter is key and second one is value
                    req.flash("error","Please Login first !");
                    
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        // in flash() function , first parameter is key and second one is value
        req.flash("error","Please Login first !");
        
        res.redirect("back");
    }

    //back means to previous page
}

// check who owns the comment
middlewareObj.checkCommentOwner = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        var commentId = req.params.comment_id;

        Comment.findById(commentId, function(err,foundComment)
        {
            if(err)
            res.redirect("back");
            else
            {
                var foundId = foundComment.author.id;
                var loggedinId = req.user._id; 
                
                if(foundId.equals(loggedinId))
                next();
                else
                {
                    // in flash() function , first parameter is key and second one is value
                    req.flash("error","Please Login first !");
                    
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        // in flash() function , first parameter is key and second one is value
        req.flash("error","Please Login first !");
        
        res.redirect("back");
    }

    //back means to previous page
}

// you can give any name to a function ( middleware )
middlewareObj.isLoggedIn = function(req, res, next)
{
    // next as a parameter will run the call back function which will render the secret page
    
    if(req.isAuthenticated())
    return next();
    
    // in flash() function , first parameter is key and second one is value
    req.flash("error","Please Login first !");
    
    res.redirect("/login");
}

module.exports = middlewareObj;