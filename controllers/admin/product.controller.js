const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree")
const Account = require("../../models/account.model");



// [GET] /admin/product
module.exports.index = async (req, res) => {

    // console.log(req.query.status);

    // Bo loc
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,

    };
    if (req.query.status) {
        find.status = req.query.status
    }

    // search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;

    }

    //pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            litmitItems: 4
        },
        req.query,
        countProducts
    )


    //end pagination

    // sort
    let sort ={};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }else{
        sort.position = "desc";
    }


    //end sort



    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.litmitItems)
        .skip(objectPagination.skip);
    for(const product of products){
        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id:product.createdBy.account_id
        })
        if(user){
            product.accountFullName = user.fullname
        }
        // Lấy ra thông tin người tạo gần nhất 
       
        const updatedBy = product.updatedBy[product.updatedBy.length - 1];
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id:updatedBy.account_id
            })
            updatedBy.accountFullName = userUpdated.fullname
        }

    }
   

    res.render("admin/pages/products/index", {
        pageTitle: "Trang sản phẩm ",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};
// [GET] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt:new Date()
    }
    await Product.updateOne({ _id: id }, { status: status,$push:{updatedBy} });
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect("back");
}
// [GET] /admin/product/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt:new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active",$push:{updatedBy} })
            req.flash('success', `Cập nhật trạng thái thành công${ids.length} sản phẩm !`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive",$push:{updatedBy} })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deleteAt: new Date()
            })
            req.flash('success', `Xóa thành công ${ids.length} sản phẩm !`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);

                await Product.updateOne({ _id: id }, {
                    position: position,
                    $push:{updatedBy}
                });
                req.flash('success', `cập nhật thành công vị trí  ${ids.length} sản phẩm !`);
            }


            break;
        default:
            break;
    }
    res.redirect("back");
}
// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id:id});
    await Product.updateOne({ _id: id }, {
        deleted: true,
        // deleteAt: new Date()
        deletedBy:{
            account_id:res.locals.user.id,
            deletedAt: new Date()
        }
    });

    req.flash('success', `Đã xóa thành công sản phẩm !`);

    res.redirect("back");
}

// [GET] /admin/product/create
module.exports.create = async (req, res) => { 
    console.log(res.locals.user);
    let find = {
        deleted: false,

    };
    const category = await ProductCategory.find(find)
    const newCategory =createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category:newCategory
    })
}
// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.dicountPercentage = parseInt(req.body.dicountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position =='') {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
        account_id:res.locals.user.id
    }
    const product = new Product(req.body)
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/product`);
}
// [GET] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find={
            deleted:false,
            _id:req.params.id
        }
        const product = await Product.findOne(find);
        const category = await ProductCategory.find({ deleted:false,});
        const newCategory =createTreeHelper.tree(category);
        res.render("admin/pages/products/edit.pug", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product:product,
            category:newCategory
        })
    } catch (error) {
        req.flash("error","Không tồn tại")
        res.redirect(`${systemConfig.prefixAdmin}/product`);

    }
    
}
// [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.price = parseInt(req.body.price);
    req.body.dicountPercentage = parseInt(req.body.dicountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt:new Date()
        }
       
        await Product.updateOne({_id:id},{
            ...req.body,
            $push:{updatedBy}
        })
        req.flash("success","Cập nhật thành công!")
    } catch (error) {
        req.flash("error","Cập nhật thất bại!")
    }
    res.redirect("back");
    
}

// [GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find={
            deleted:false,
            _id:req.params.id
        }
        const product = await Product.findOne(find);
        console.log(product)
        res.render("admin/pages/products/detail.pug", {
            pageTitle: product.title,
            product:product
        })
    } catch (error) {
        req.flash("error","Không tồn tại")
        res.redirect(`${systemConfig.prefixAdmin}/product`);

    }
    
}