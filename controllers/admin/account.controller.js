const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");

var md5 = require('md5');
const systemConfig = require("../../config/system")
//[GET] /admin/account
module.exports.index = async (req, res) => {
    const find ={
        deleted:false
    };
    const records = await Account.find(find).select("-password -token");
    for (const record of records){
        const role = await Role.findOne({
            _id:record.role_id,
            deleted:false
        });
        record.role = role;
    }
    res.render("admin/pages/account/index", {
        pageTitle: "Tạo tài khoản mới ",
        record:records 

    });
}
//[GET] /admin/account/create
module.exports.create = async (req, res) => {
    const  roles = await Role.find({deleted:false});
    console.log(roles)
    res.render("admin/pages/account/create", {
        pageTitle: "Tạo tài khoản mới ",
        roles:roles
    });
}
//[POST] /admin/account/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email:req.body.email,
        deleted:false
    });

    if(emailExist){
        req.flash("error",`email ${req.body.email} đã tồn tại `);
        res.redirect("back")
    }else{
        req.body.password = md5( req.body.password);

    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/account`);
    }

}
//[GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
    const find ={
        _id:req.params.id,
        deleted:false
    };
    try {
        const data = await Account.findOne(find);
       
            const role = await Role.find({
                deleted:false
            });
          
    
        res.render("admin/pages/account/edit", {
            pageTitle: "Chỉnh sửa  khoản mới ",
            data:data,
            role:role
    
        });
        
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
    
}
//[PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const emailExist = await Account.findOne({
        _id:{$ne :id},
        email:req.body.email,
        deleted:false
    });
    if(emailExist){
        req.flash("error",`email ${req.body.email} đã tồn tại `);
    }else{
        if(req.body.password){
            req.body.password=md5(req.body.password);
        }else{
            delete req.body.password;
        }
    
        await Account.updateOne({_id:id},req.body);
        req.flash("success","Cập nhật thành công ")
    }
   
    res.redirect("back");
    
}