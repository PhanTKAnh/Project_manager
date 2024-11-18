const dashboardRoutes = require("./dashboard.route");
const sytemConfig = require("../../config/system");
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
module.exports = (app) => {
  const PATCH_ADMIN =sytemConfig.prefixAdmin;
   app.use(PATCH_ADMIN + "/dashboard",dashboardRoutes);
   app.use(PATCH_ADMIN + "/product",productRoutes)
   app.use(PATCH_ADMIN + "/product-category",productCategoryRoutes)
  
}