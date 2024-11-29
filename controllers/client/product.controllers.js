//[GET] /product
const Product = require("../../models/product.model")
const productCategory = require("../../models/product-category.model")
const productHelper = require("../../helpers/product")
const productsCategoryHelper = require("../../helpers/product-category")


module.exports.index = async (req, res) => {
    const products =await Product.find({
        status:"active",
        deleted:false
    }).sort({position:"desc"});

    const newProduct =productHelper.priceNewProducts(products);

    res.render("client/pages/products/index",{
        pageTitle:"Danh sách sản phẩm",
        products:newProduct
    });
};
//[GET] /product/:slug
module.exports.detail = async (req, res) => {
    try {
        const find={
            deleted:false,
            slug:req.params.slugProduct,
            status:"active"
        }
        const product = await Product.findOne(find);
        if(product.product_category_id){
            const category = await productCategory.findOne({
                _id:product.product_category_id,
                status:"active",
                deleted:false
            });
            product.category = category
        }
       product.priceNew  = productHelper.priceNewProduct(product)


        res.render("client/pages/products/detail",{
            pageTitle:"Danh sách sản phẩm",
            product: product
        });
    } catch (error) {
        req.flash("error","Không tồn tại")
        res.redirect(`/product`);

    }
    
}
//[GET] /product/:slugCategory
module.exports.category = async (req, res) => {
try {
        const category = await productCategory.findOne({
        slug:req.params.slugCategory,
        status:"active",
        deleted:false
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item =>(item.id))

    const products = await Product.find({
        product_category_id:{$in:[category.id, ...listSubCategoryId]},
        deleted:false
    }).sort({position:"desc"});
    const newProduct = productHelper.priceNewProduct(products);

    res.render("client/pages/products/index",{
        pageTitle:category.title,
        products: newProduct
    });
    
} catch (error) {
    
}
       
}