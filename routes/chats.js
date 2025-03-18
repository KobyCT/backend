const express = require('express');

const {createChat,getChats} = require('../controllers/chats');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/newchat').post(protect,authorize('admin','acceptuser'),createChat);
router.route('/:id').get(protect,authorize('admin','acceptuser'),getChats);

module.exports = router;