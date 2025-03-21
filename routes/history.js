const express = require('express');
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const {createHistory,getHistory,updateHistory,deleteHistory,getWithBuyerProduct} = require('../controllers/history');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,authorize('admin','acceptuser'),getHistory).post(protect,authorize('admin','acceptuser'),upload.single('payment'),createHistory);
router.route('/p/:id').get(protect,authorize('admin','acceptuser'),getWithBuyerProduct);
router.route('/:id').put(protect,authorize('admin'),updateHistory).delete(protect,authorize('admin'),deleteHistory);

module.exports = router;