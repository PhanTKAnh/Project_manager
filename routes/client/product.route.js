const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controllers")

router.get('/', controller.index);
router.get('/:slugCategory', controller.category);

router.get('/detail/:slugProduct', controller.detail);


module.exports = router;