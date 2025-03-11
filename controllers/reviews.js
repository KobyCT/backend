const Review = require('../models/review')

exports.getReviews = async(req,res,next) => {
    const query = `SELECT * FROM reviews;`;

    await Review.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.getReview = async(req,res,next) => {
    if(!req.params.id){
        res.status(400).json({success:false,message:'Does not get id!'});
    }

    const query = `SELECT * FROM reviews WHERE sellerId = ${req.params.id};`;

    await Review.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.myReview = async(req,res,next) => {
    if(!req.params.id){
        res.status(400).json({success:false,message:'Does not get id!'});
    }

    const query = `SELECT * FROM reviews WHERE reviewerId = ${req.params.id};`;

    await Cart.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.addReview = async(req,res,next) => {
    if(!req.params.id){
        res.status(400).json({success:false,message:'Does not get id!'});
    }

    const review = new Review({
        sellerId: review.sellerId,
        reviewerId: review.reviewerId,
        score: review.score,
        comment: review.comment
    });

    await Review.addReview();
};