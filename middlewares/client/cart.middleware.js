const Cart = require("../../models/cart.model")
module.exports.cartId = async (req,res,next) =>{
    if(!req.cookies.cartId){
        // Tạo giỏ hàng
        const cart = new Cart();
        await  cart.save();
        
        
        const expiresCookie =365 * 60 * 60 *1000
        res.cookie("cartId",cart.id, { expires: new Date(Date.now() + expiresCookie) });
    }else{
        // Lấy ra thôi 
    }
    next();
}