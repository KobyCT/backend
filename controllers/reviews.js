const Review = require('../models/review')

exports.getReviews = (req,res,next) => {
    const query = `SELECT * FROM reviews;`;

    Review.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.getReview = (req,res,next) => {
    if(!req.params.id){
        res.status(400).json({success:false,message:'Does not get id!'});
    }

    const query = `SELECT * FROM reviews WHERE sellerId = '${req.params.id}';`;

    Review.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.myReview = (req,res,next) => {
    const query = `SELECT * FROM reviews WHERE reviewerId = '${req.user.uid}';`;

    console.log(query);

    Review.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.addReview = (req,res,next) => {
    if(Object.keys(req.body).length === 0){
        res.status(400).json({success:false,message:'Contect cannot be empty!'});
        return;
    }

    const review = new Review({
        sellerId: req.body.sellerId,
        reviewerId: req.user.uid,
        score: req.body.score,
        comment: req.body.comment
    });

    Review.addReview(review,(err,data)=>{
        if(err) {
            res.status(400).json({succes:false,message:err});
            return;
        }
        res.status(201).json({succes:true,data:data});
    });
};

exports.editReview = async(req,res,next) => {
    if(!req.body){
        res.status(400).json({success:false,message:'Contect cannot be empty!'});
    }
    const reviewId = req.body.reviewId;

    const review = new Review({
        sellerId: null,
        reviewerId: null,
        score: req.body.score,
        comment: req.body.comment
    });


    await Review.updateReview(reviewId,review,(err,data)=>{
        if(err) res.status(400).json({succes:false,message:err});
        res.status(200).json({succes:true,data:data});
    });
};

exports.deleteReview = async(req,res,next) => {
    if(!req.params.id){
        res.status(400).json({success:false,message:'Contect cannot be empty!'});
    }

    const reviewId = req.params.id;

    await Review.removeReview(reviewId,(err,data)=>{
        if(err) res.status(400).json({succes:false,message:err});
        res.status(200).json({succes:true,data:data});
    });
};