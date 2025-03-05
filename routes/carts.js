const express = require('express');

const {myCart,addToCart,editCart} = require('../controllers/carts');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/mycart').get(protect,myCart);
router.route('/add/:productId').post(protect,addToCart);
router.route('/edit/:productId').post(protect,editCart);

module.exports = router;