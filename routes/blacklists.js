const express = require('express');

const {getBlacklist,banUser,unBanUser} = require('../controllers/blacklists');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,authorize('admin'),getBlacklist);
router.route('/ban/:id').get(protect,authorize('admin'),banUser);
router.route('/unban/:id').get(protect,authorize('admin'),unBanUser);

module.exports = router;