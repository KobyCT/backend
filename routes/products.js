const express = require('express');

const {getProducts,search,getMyProducts,createProduct,updateProduct,deleteProduct,getAllType,AddType,getRecommendProducts,deleteType} = require('../controllers/products');

const {protect} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,getProducts).post(protect,createProduct);
router.route('/search').get(protect,search);
router.route('/myproduct').get(protect,getMyProducts);
router.route('/:id').put(protect,updateProduct).delete(protect,deleteProduct);
router.route('/type/').get(protect,getAllType).post(protect,AddType).delete(protect,deleteType);
router.route('/recommend/:id').get(protect,getRecommendProducts);

module.exports = router;