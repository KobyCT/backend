const express = require('express');

const {getCallback,getUser,getUsers,getMe} = require('../controllers/auth');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/callback').get(getCallback);
router.route('/me').get(protect,authorize('admin','acceptuser'),getMe);
router.route('/:id').get(protect,authorize('admin','acceptuser'),getUser);
router.route('/').get(protect,authorize('admin','acceptuser'),getUsers);

module.exports = router;