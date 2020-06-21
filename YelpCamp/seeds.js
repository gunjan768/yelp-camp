var mongoose    =   require("mongoose");
var Campground  =   require("./models/campground");
var Comment     =   require("./models/comment");

// var data = [
//     {   
//         name: "Ranchi Lake" ,
//         image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" ,
//         description: "Beautiful one" ,
//     } ,
//     {   
//         name: "Upper Bazar Hill" ,
//         image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" ,
//         description: "Wonderful" ,
//     },
//     {   
//         name: "Tagore Hill" ,
//         image: "https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" ,
//         description: "Amazing" ,
//     }
// ]

function seedDB()
{
    // will remove all the campgrounds
    Campground.remove({},function(err)
    {
        if(err)
        console.log(err);

        console.log("Removed");
        
        //add all campgrounds that are in array name "data"
        data.forEach(function(seed)
        {
            Campground.create(seed , function(err,campground)
            {
                if(err)
                console.log(err);
                else
                {
                    console.log("Added");
                    
                    // comment is created and saved to table name "comment"
                    Comment.create(
                    {
                        text: "This is lover" ,
                        author: "Emilia Gunjan"
                    },
                    function(err,comment)
                    {
                        if(err)
                        console.log(err);
                        else
                        {
                            //pushing the above created comment into campground but we need to save it to database. 
                            // So we use save() function

                            // pushing into campground 
                            campground.comments.push(comment);

                            //saving it to database
                            campground.save();

                            console.log("Comment");
                        }
                    })
                }
            })
        })
    })
}

// will export the function seedDB()
module.exports = seedDB;