const express = require("express");
const {sendMessage, getMessage} = require("../controllers/messageController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");
const router = express.Router();

router.route('/send/:id').post(isAuthenticated,sendMessage);
router.route('/all/:id').get(isAuthenticated,getMessage);


module.exports = router


