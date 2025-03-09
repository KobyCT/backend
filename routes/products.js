const express = require('express');

const {getProducts,getProductsWithType,createProduct,updateProduct,deleteProduct,getAllType,AddType,getRecommentProducts,deleteType} = require('../controllers/products');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,getProducts).post(protect,createProduct);
router.route('/:id').put(protect,updateProduct).delete(protect,deleteProduct);
router.route('/type/').get(protect,getAllType).post(protect,AddType).delete(protect,deleteType);
router.route('/type/:id').get(protect,getRecommentProducts);

module.exports = router;