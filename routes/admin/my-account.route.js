const express = require("express");
const router = express.Router();
const multer = require('multer');

const upload = multer()

const controller = require("../../controllers/admin/my-account.controller")
const validate = require("../../validates/admin/account.validate")
const uploadCloud= require("../../middlewares/admin/uploadCloud.middlewares")


router.get('/', controller.index);
router.get('/edit', controller.edit);
router.patch('/edit',
    upload.single('avatar'),
    uploadCloud.upload,
    controller.editPatch);

module.exports = router;