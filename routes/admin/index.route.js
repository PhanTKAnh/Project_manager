const dashboardRoutes = require("./dashboard.route");
const sytemConfig = require("../../config/system");
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const rolesRoute = require("./roles.route")
const accountRoute = require("./account.route")
const authRoute = require("./ath.route")
module.exports = (app) => {
  const PATCH_ADMIN =sytemConfig.prefixAdmin;
   app.use(PATCH_ADMIN + "/dashboard",dashboardRoutes);
   app.use(PATCH_ADMIN + "/product",productRoutes)
   app.use(PATCH_ADMIN + "/product-category",productCategoryRoutes)
   app.use(PATCH_ADMIN + "/roles",rolesRoute)
   app.use(PATCH_ADMIN + "/account",accountRoute)
   app.use(PATCH_ADMIN + "/auth",authRoute)
  
}