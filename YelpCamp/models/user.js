var mongoose         =   require("mongoose");
var pssprtMong       =   require("passport-local-mongoose");

var userSchema = new  mongoose.Schema(
{
    username: String ,
    password: String 
})

//plugin will add bunch of methods to userSchema which comes inbuilt with passport-local-mongoose
// like serialize and deserialize
userSchema.plugin(pssprtMong);

var User = mongoose.model("User",userSchema);

module.exports = User;