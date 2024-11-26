const Account = require("../../models/account.model");

var md5 = require('md5');
const systemConfig = require("../../config/system")
// [GET] /admin/auth/login
module.exports.login= (req, res) => {
    console.log(req.cookies.token);
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }else{
        res.render("admin/pages/auth/login",{
            pageTitle:"Đăng nhập "
        });
    }
    
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
// [GET] /admin/auth/login
module.exports.logout= (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
};