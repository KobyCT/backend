const express = require('express');

const {getCallback,login,getUsers,getMe} = require('../controllers/auth');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/callback').get(getCallback);
router.route('/me').get(protect,authorize('admin','acceptuser'),getMe);
router.route('/').get(protect,authorize('admin'),getUsers);

module.exports = router;