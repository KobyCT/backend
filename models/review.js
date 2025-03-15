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

Review.addReview = (newReview, result) => {
    const { sellerId, reviewerId, score, comment } = newReview;
    
    const query = `
    INSERT INTO reviews (sellerId, reviewerId, score, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const values = [sellerId, reviewerId, score, comment];

    sql.query(query, values, (err, res) => {
        if (err) {
            console.log('create error:', err);
            result(err, null);
            return;
        }
        console.log('create review:', res.rows);
        result(null, res.rows);
    });
};


Review.updateReview = (reviewId, editReview, result) => {
    const { score, comment } = editReview;

    const query = `
    UPDATE reviews 
    SET score = $1, comment = $2
    WHERE reviewId = $3
    RETURNING *;
    `;

    const values = [score, comment, reviewId];

    try{
        sql.query(query, values, (err, res) => {
            if (err) {
                console.log('update error:', err);
                result(err, null);
                return;
            }
    
            if (res.rowCount === 0) {
                result({ message: "No review found" }, null);
                return;
            }
    
            console.log('update review:', res.rows);
            result(null, res.rows);
        });

    }catch(error){
        result(error, null);
                return;
    }

};


Review.removeReview = (reviewId,result)=>{
    const query = `
    DELETE FROM reviews WHERE reviewId = $1 RETURNING *;`;

    const value = [reviewId];

    sql.query(query,value, (err, res)=>{
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