//[GET] /product
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products =await Product.find({
        status:"active",
        deleted:false
    }).sort({position:"desc"});

    const newProduct = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(1);
        return item
    })

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