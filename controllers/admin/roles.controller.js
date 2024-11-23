const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system")
//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const find ={
        deleted:false
    };
    const record = await Role.find(find);
    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền ",
        record:record 

    });
}
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
}
//[Post] /admin/roles/create
module.exports.createPost = async (req, res) => {
    console.log(req.body);
    const record = new Role(req.body);
    await record.save();
   res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
//[GET] /admin/roles/edit/id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find ={
        _id:id,
        deleted: false
    }
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
        pageTitle: "Tạo nhóm quyền",
        data:data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }
}
//[POST] /admin/roles/edit/id
module.exports.editPatch = async (req, res) => {

    const id = req.params.id;
 
       await Role.updateOne({ _id: id }, req.body);
        res.redirect(`${systemConfig.prefixAdmin}/roles`)

    }
 //[GET] /admin/permission
module.exports.permissions = async (req, res) => {
   let find= {
    deleted: false
   }
   const record = await Role.find(find);
      res.render("admin/pages/roles/permission", {
          pageTitle: "Tạo nhóm quyền",
          record:record
      });
  }
 //[PATCH] /admin/permission
 module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
   
    for (const item of permissions) {
        await Role.updateOne({_id: item.id},{permissions: item.permisions});
        
    }
    res.redirect("back")
   }