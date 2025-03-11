const express = require('express');

const {createChat,getChats} = require('../controllers/chats');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/newchat').post(protect,createChat);
router.route('/').get(protect,getChats);

module.exports = router;