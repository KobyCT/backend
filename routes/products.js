const express = require('express');
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const {getProducts,getProductCount,search,getMyProducts,createProduct,updateProduct,getUnApproveProducts,approveProducts,unApproveProducts,deleteProduct,getAllTag,AddTag,getRecommendProducts,deleteTag} = require('../controllers/products');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect,authorize('admin','acceptuser'),getProducts).post(protect,authorize('admin','acceptuser'), upload.single('image'), createProduct);
router.route('/approve/:id').get(protect,authorize('admin'),approveProducts);
router.route('/unapprove/:id').get(protect,authorize('admin'),unApproveProducts);
router.route('/approve').get(protect,authorize('admin'),getUnApproveProducts);
router.route('/search').get(protect,authorize('admin','acceptuser'),search);
router.route('/myproduct').get(protect,authorize('admin','acceptuser'),getMyProducts);
router.route('/tag/').get(protect,authorize('admin','acceptuser'),getAllTag).post(protect,authorize('admin','acceptuser'),AddTag).delete(protect,authorize('admin','acceptuser'),deleteTag);
router.route('/amount').get(protect,authorize('admin','acceptuser'),getProductCount);
router.route('/:id').put(protect,authorize('admin','acceptuser'),updateProduct).delete(protect,authorize('admin','acceptuser'),deleteProduct);
router.route('/recommend/:id').get(protect,authorize('admin','acceptuser'),getRecommendProducts);

module.exports = router;