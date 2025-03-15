const express = require('express');

const {getReview,getReviews,addReview,deleteReview,editReview,myReview} = require('../controllers/reviews');

const {protect,authorize} = require('../middlewares/auth');

const router = express.Router();

router.route('/myreview').get(protect,authorize('admin','acceptuser'),myReview);
router.route('/').get(protect,authorize('admin','acceptuser'),getReviews).post(protect,authorize('admin','acceptuser'),addReview).put(protect,authorize('admin','acceptuser'),editReview);
router.route('/:id').get(protect,authorize('admin','acceptuser'),getReview).delete(protect,authorize('admin','acceptuser'),deleteReview);

module.exports = router;