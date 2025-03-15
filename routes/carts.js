const express = require('express');

const {myCart,addToCart,editCart} = require('../controllers/carts');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/mycart').get(protect,authorize('admin','acceptuser'),myCart);
router.route('/add/').post(protect,authorize('admin','acceptuser'),addToCart);
router.route('/edit/').post(protect,authorize('admin','acceptuser'),editCart);

module.exports = router;