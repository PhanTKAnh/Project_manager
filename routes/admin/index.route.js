const dashboardRoutes = require("./dashboard.route");
const sytemConfig = require("../../config/system");
const productRoutes = require("./product.route")
module.exports = (app) => {
  const PATCH_ADMIN =sytemConfig.prefixAdmin;
   app.use(PATCH_ADMIN + "/dashboard",dashboardRoutes);
   app.use(PATCH_ADMIN + "/product",productRoutes)
  
}