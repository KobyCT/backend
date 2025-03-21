const express = require('express');

const {createChat,getChats,deleteChats,getChat} = require('../controllers/chats');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/newchat').post(protect,authorize('admin','acceptuser'),createChat);
router.route('/i/:id').get(protect,authorize('admin','acceptuser'),getChat)
router.route('/:id').get(protect,authorize('admin','acceptuser'),getChats).delete(protect,authorize('admin','acceptuser'),deleteChats);

module.exports = router;