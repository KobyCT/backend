const express = require('express');

const {getProducts,createProduct,updateProduct,deleteProduct} = require('../controllers/products');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,getProducts).post(protect,createProduct);
router.route('/:id').put(protect,updateProduct).delete(protect,deleteProduct);

module.exports = router;