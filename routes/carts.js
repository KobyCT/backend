const express = require('express');

const {myCart,addToCart,editCart} = require('../controllers/carts');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/mycart').get(protect,myCart);
router.route('/add/').post(protect,addToCart);
router.route('/edit/').post(protect,editCart);

module.exports = router;