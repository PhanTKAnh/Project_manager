const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    // Kiểm tra xem đã có cartId trong cookie chưa
    if (!req.cookies.cartId) {
      // Tạo giỏ hàng mới
      const cart = new Cart();
      await cart.save();

      // Thiết lập cookie với thời hạn 1 năm
      const expiresCookie = 365 * 24 * 60 * 60 * 1000; // 1 năm
      res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresCookie) });
    } else {
      // Tìm giỏ hàng theo cartId từ cookie
      const cart = await Cart.findOne({
        _id: req.cookies.cartId
      });

      // Kiểm tra nếu không tìm thấy giỏ hàng
      if (!cart) {
        console.warn("Giỏ hàng không tồn tại!");
        res.clearCookie("cartId");
      } else if (cart.products && cart.products.length > 0) {
        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalQuantity = totalQuantity;
        res.locals.miniCart = totalQuantity;
      }
    }
    next();
  } catch (error) {
    console.error("Lỗi trong middleware giỏ hàng:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
