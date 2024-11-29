const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree")


// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,

    };
    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;

    }
    const record = await ProductCategory.find(find)
    const newRcord =createTreeHelper.tree(record);

    res.render("admin/pages/product-category/index",{
        pageTitle: "Trang danh mục sản phẩm  ",
        record :newRcord,
        filterStatus:filterStatus,
        objectSearch:objectSearch.keyword,
    });
};
// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    
   
    const record = await ProductCategory.find(find).sort({position:"asc"});
    const newRcord =createTreeHelper.tree(record);
    console.log(newRcord)
    res.render("admin/pages/product-category/create",{
        pageTitle:"Tạo danh muc san pham",
        record:newRcord
    });
};
// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id =req.params.id;
    await ProductCategory.updateOne({_id:id},{status:status});
    res.redirect("back")
 }
 // [PATCH] /admin/product/change-multi/:status/:id
 module.exports.changeMulti  = async (req, res) => {
     const type = req.body.type;
     const ids = req.body.ids.split(",");
 
     switch (type) {
         case "active":
             await ProductCategory.updateMany({_id:{ $in: ids }},{status:"active"});
             req.flash('success', `Cập nhật trạng thái thành công${ids.length} sản phẩm !`);
             break;
         case "inactive" :
             await ProductCategory.updateMany({_id:{ $in: ids }},{status:"inactive"});
             req.flash('success', `Cập nhật trạng thái thành công${ids.length} sản phẩm !`);
             break;
         case "delete-all" :
             await ProductCategory.updateMany({_id:{ $in: ids }},{
                 deleted:true,
                 deleteAt:new Date()})
                 req.flash('success', `Xóa thành công ${ids.length} sản phẩm !`);
                 break;
         case "change-position":
             for (const item of ids){
                 let [id,position] = item.split('-');
                 position = parseInt(position);
                 await ProductCategory.updateOne({_id:{ $in: id }},{position:position});
                 req.flash('success', `cập nhật thành công vị trí  ${ids.length} sản phẩm !`);
             }
            
         default:
             break;
     }
     res.redirect("back");
  }
  // [DELETE] /admin/product/delete
 module.exports.deleteItem= async (req, res) => {
     const id = req.params.id;
     console.log(id);
     await ProductCategory.updateOne({_id:id},{
         deleted:true,
         deleteAt:new Date()
     });
     req.flash('success', `Đã xóa thành công sản phẩm !`);
 
     res.redirect("back");
  }
// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    const permissions =res.locals.role.permissions;
    if(permissions.includes("products-category_create")){
        if (req.body.position =='') {
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position)
        }
        if(req.file){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        const record = new ProductCategory(req.body)
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
        console.log("có quyền")

    }else{
        console.log("403");
        return;
    }

   
}

 // [GET] /admin/product/edit
module.exports.edit = async (req, res) => {
    try {
        let find = {
            deleted: false,
    
        };
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id:id,
            deleted:false
        });
        const record = await ProductCategory.find(find)
        const newRcord =createTreeHelper.tree(record);
    
    
        res.render("admin/pages/product-category/edit",{
            pageTitle: "Chỉnh sửa danh mục sản phẩm  ",
            data:data,
            record :newRcord
    
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
   
 }
  // [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne({_id:id},req.body);
    
    res.redirect("back")

 }