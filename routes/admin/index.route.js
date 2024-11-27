const dashboardRoutes = require("./dashboard.route");

const authMiddware = require("../../middlewares/admin/auth.middleware")
const sytemConfig = require("../../config/system");
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const rolesRoute = require("./roles.route")
const accountRoute = require("./account.route")
const authRoute = require("./auth.route")
const myAccountRoute = require("./my-account.route")
module.exports = (app) => {
  const PATCH_ADMIN = sytemConfig.prefixAdmin;
  app.use(
    PATCH_ADMIN + "/dashboard",
    authMiddware.requireAuth,
    dashboardRoutes);
  app.use(
    PATCH_ADMIN + "/product",
    authMiddware.requireAuth,
    productRoutes)
  app.use(
    PATCH_ADMIN + "/product-category",
    authMiddware.requireAuth,
    productCategoryRoutes)
  app.use(
    PATCH_ADMIN + "/roles",
    authMiddware.requireAuth,
    rolesRoute)
  app.use(
    PATCH_ADMIN + "/account",
    authMiddware.requireAuth,
    accountRoute)
  app.use(
    PATCH_ADMIN + "/auth",
    authRoute)
    app.use(
      PATCH_ADMIN + "/my-account",
      authMiddware.requireAuth,
      myAccountRoute)

}