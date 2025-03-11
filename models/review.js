const sql = require('../config/pgdb');

const Review = function(review){
    this.sellerId = review.sellerId;
    this.reviewerId = review.reviewerId;
    this.score = review.score;
    this.comment = review.comment;
};

Review.query = (query,result) => {
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All reviews');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Review.addReview = (newReview,result)=>{
    const {sellerId,reviewerId,score,comment} = newReview;
    
    const query = `
    INSERT INTO reviews (sellerId,reviewerId,score,comment)
    VALUES ('${sellerId}','${reviewerId}','${score}','${comment}'')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('create review:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Review.updateReview = (reviewId,editReview,result)=>{
    const {score,comment} = editReview;

    const query = `
    UPDATE reviews 
    SET score = '${score}' ,comment ='${comment}'
    WHERE sellerId = '${reviewId}'
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('create review:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Review.removeReview = (reviewId,result)=>{
    const query = `
    DELETE FROM reviews WHERE id = ${reviewId} RETURNING *;`;

    sql.query(query, (err, res)=>{
        if(err){
            console.log('error: ',err);
            result(null, err);
            return;
        }
        if(res.affectedRows == 0){
            result({kind:'not_found'},null);
            return;
        }

        console.log('delete review with id: ', reviewId);
        result(null, res.rows);
    });
};

module.exports = Review;