const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/room-chat.controllers.js")
router.get('/',controller.index);
router.get('/create',controller.create);
router.post('/create',controller.createPost);
module.exports = router;