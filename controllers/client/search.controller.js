const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

//[GET] / search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    
    let newProducts = [];

    if(keyword){
        const regex = new RegExp(keyword,"i");
        const products = await Product.find({
            title:regex,
            status:"active",
            deleted:false
        });
        newProducts = productHelper.priceNewProducts(products);
    }
   
    res.render("client/pages/search/index",{
        pageTitle:"Kết quả tìm kiếm",
        keyword:keyword,
        products:newProducts
    })
}
