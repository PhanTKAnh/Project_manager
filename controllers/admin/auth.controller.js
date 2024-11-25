const Account = require("../../models/account.model");

var md5 = require('md5');
const systemConfig = require("../../config/system")
const validate = require("../../validates/admin/auth.validate")

// [GET] /admin/auth/login
module.exports.login= (req, res) => {
    res.render("admin/pages/auth/login",{
        pageTitle:"Đăng nhập "
    });
};
// [POST] /admin/auth/login
module.exports.loginPost= async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Account.findOne({
        email:email,
        deleted:false
    });

   if(!user){
    req.flash("error","Email không tồn tại");
    res.redirect("back");
    return;
   }
   console.log(password);
   if(md5(password) != user.password){
    req.flash("error","Mật khẩu không chính xác");
    res.redirect("back");
    return;
   }
   if(user.status == "inactive"){
    req.flash("error","Tài khoản đã bị khóa ");
    res.redirect("back");
    return;
   }
   res.cookie("token", user.token)
   res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
};