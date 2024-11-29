const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")
//[GET] /
module.exports.index = async (req, res) => {
    // lấy ra sản phẩm nổi bật
    const productFeature = await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(6);

    const newProductFeature =productHelper.priceNewProducts(productFeature);
    // lấy ra sản phẩm nổi bật

    // Hiển thị sản phẩm mới nhẩt
     const productNew = await Product.find({
        deleted:false,
        status:"active"
     }).sort({position:"desc"}).limit(6)

    // End Hiển thị sản phẩm mới nhẩt
    const newProductNew =productHelper.priceNewProducts(productNew);
    res.render("client/pages/home/index",{
        pageTitle:"Trang chủ",
        productFeature:newProductFeature,
        productNew:newProductNew
    })
};