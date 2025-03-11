const express = require('express');

const {getProducts,search,getMyProducts,createProduct,updateProduct,getUnApproveProducts,approveProducts,unApproveProducts,deleteProduct,getAllType,AddType,getRecommendProducts,deleteType} = require('../controllers/products');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,getProducts).post(protect,createProduct);
router.route('/approve/:id').get(protect,authorize('admin'),approveProducts);
router.route('/unapprove/:id').get(protect,authorize('admin'),unApproveProducts);
router.route('/approve').get(protect,authorize('admin'),getUnApproveProducts);
router.route('/search').get(protect,search);
router.route('/myproduct').get(protect,getMyProducts);
router.route('/:id').put(protect,updateProduct).delete(protect,deleteProduct);
router.route('/type/').get(protect,getAllType).post(protect,AddType).delete(protect,deleteType);
router.route('/recommend/:id').get(protect,getRecommendProducts);

module.exports = router;