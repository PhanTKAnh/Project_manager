const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination");


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
    function createTree(arr,parentId = ""){
        const tree = [];
        arr.forEach((item) => {
            if(item.parent_id === parentId){
                const newItem = item;
                const children = createTree(arr,item.id);
                if(children.length>0){
                    newItem.children = children;
                }
                tree.push(newItem);
            }
            
        });
        return tree;
    }
    const record = await ProductCategory.find(find)
    const newRcord =createTree(record);

    res.render("admin/pages/product-category/index",{
        pageTitle: "Trang danh mục sản phẩm  ",
        record :newRcord,
        filterStatus:filterStatus,
        objectSearch:objectSearch.keyword,
    });
};
// [GET] /admin/product-category
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    
    function createTree(arr,parentId = ""){
        const tree = [];
        arr.forEach((item) => {
            if(item.parent_id === parentId){
                const newItem = item;
                const children = createTree(arr,item.id);
                if(children.length>0){
                    newItem.children = children;
                }
                tree.push(newItem);
            }
            
        });
        return tree;
    }
    const record = await ProductCategory.find(find).sort({position:"asc"});
    const newRcord =createTree(record);
    console.log(newRcord)
    res.render("admin/pages/product-category/create",{
        pageTitle:"Tạo danh muc san pham",
        record:newRcord
    });
};
// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position =='') {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position)
    }
    console.log(req.body)
    const record = new ProductCategory(req.body)
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}
// [GET] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
   const status = req.params.status;
   const id =req.params.id;
   await ProductCategory.updateOne({_id:id},{status:status});
   res.redirect("back")
}
// [GET] /admin/product/change-multi/:status/:id
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