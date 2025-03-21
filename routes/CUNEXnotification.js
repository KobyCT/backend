const express = require('express');

const { sendNotification } = require('../controllers/CUNEXnotification')

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/send').post(protect,authorize('admin','acceptuser'),sendNotification);

module.exports = router;