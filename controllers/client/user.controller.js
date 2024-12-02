const User = require("../../models/user.model")
var md5 = require('md5');
//[GET] /user
module.exports.register = async (req, res) => {
   
    res.render("client/pages/user/register",{
        pageTitle:"Kết quả tìm kiếm",
    })
}
//[POST] / user
module.exports.registerPost = async (req, res) => {
   const existEmail = await User.findOne({
    email:req.body.email
   });
   if(existEmail){
    req.flash("error","Eamil đã tồn tại ")
    res.redirect("back");
    return;
   }
   req.body.password = md5(req.body.password);

   const user = new User(req.body);
   await user.save();
   
   res.cookie("tokenUser",user.tokenUser)
   res.redirect("/")

}
