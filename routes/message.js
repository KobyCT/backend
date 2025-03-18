const express = require('express');

const {createMessage,getMessage} = require('../controllers/messages');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(protect,authorize('admin','acceptuser'),createMessage);
router.route('/:chatId').get(protect,authorize('admin','acceptuser'),getMessage);

module.exports = router;