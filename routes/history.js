const express = require('express');

const {createHistory,getHistory,updateHistory,deleteHistory} = require('../controllers/history');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,authorize('admin','acceptuser'),getHistory).post(protect,authorize('admin','acceptuser'),createHistory);
router.route('/:id').put(protect,authorize('admin'),updateHistory).delete(protect,authorize('admin'),deleteHistory);

module.exports = router;