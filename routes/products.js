const express = require('express');

const {getProducts,search,getMyProducts,createProduct,updateProduct,getUnApproveProducts,approveProducts,unApproveProducts,deleteProduct,getAllType,AddType,getRecommendProducts,deleteType} = require('../controllers/products');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,authorize('admin','acceptuser'),getProducts).post(protect,authorize('admin','acceptuser'),createProduct);
router.route('/approve/:id').get(protect,authorize('admin'),approveProducts);
router.route('/unapprove/:id').get(protect,authorize('admin'),unApproveProducts);
router.route('/approve').get(protect,authorize('admin'),getUnApproveProducts);
router.route('/search').get(protect,authorize('admin','acceptuser'),search);
router.route('/myproduct').get(protect,authorize('admin','acceptuser'),getMyProducts);
router.route('/:id').put(protect,authorize('admin','acceptuser'),updateProduct).delete(protect,authorize('admin','acceptuser'),deleteProduct);
router.route('/type/').get(protect,authorize('admin','acceptuser'),getAllType).post(protect,authorize('admin','acceptuser'),AddType).delete(protect,authorize('admin','acceptuser'),deleteType);
router.route('/recommend/:id').get(protect,authorize('admin','acceptuser'),getRecommendProducts);

module.exports = router;