//[GET] /product
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")


module.exports.index = async (req, res) => {
    const products =await Product.find({
        status:"active",
        deleted:false
    }).sort({position:"desc"});

    const newProduct =productHelper.priceNewProduct(products);

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
            slug:req.params.slug,
            status:"active"
        }
        const product = await Product.findOne(find);
        res.render("client/pages/products/detail",{
            pageTitle:"Danh sách sản phẩm",
            product: product
        });
    } catch (error) {
        req.flash("error","Không tồn tại")
        res.redirect(`/product`);

    }
    
}