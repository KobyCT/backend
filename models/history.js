const sql = require('../config/pgdb');

const History = function(history){
    this.buyerId = history.buyerId;
    this.productId = history.productId;
    this.paymentURL = history.paymentURL;
    this.amount = history.amount;
    this.quantity = history.quantity;
};

History.getAll = (result) => {
    const query = `SELECT * FROM history;`
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All History');
        console.log(res.rows);
        result(null, res.rows);
    });
};

History.getMyHistory = (userId,result) => {
    const query = `SELECT * FROM history WHERE buyerId = ${userId};`
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All History');
        console.log(res.rows);
        result(null, res.rows);
    });
};

History.createHistory = (newHistory, result) => {
    const { buyerId, productId, paymentURL, amount, quantity } = newHistory;
    
    // ใช้ parameterized query
    const query = `INSERT INTO history (buyerId, productId, paymentURL, amount, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    
    const values = [buyerId, productId, paymentURL, amount, quantity];

    sql.query(query, values, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        console.log('Create History');
        console.log(res.rows);
        result(null, res.rows);
    });
};


History.updateHistory = (updateHistory, historyId, result) => {
    try {
        const { buyerId, productId, paymentURL, amount, quantity } = updateHistory;

        const query = `
        UPDATE history 
        SET buyerId = $1, productId = $2, paymentURL = $3, amount = $4, quantity = $5 
        WHERE historyId = $6
        RETURNING *;
        `;

        const values = [buyerId, productId, paymentURL, amount, quantity, historyId];

        sql.query(query, values, (err, res) => {
            if (err) {
                console.log('error: ', err);
                result(err, null);
                return;
            }
            console.log('Update History');
            console.log(res.rows);
            result(null, res.rows);
        });

    } catch (error) {
        console.log('Unexpected error:', error);
        result(error, null);
    }
};


History.deleteHistory = (historyId,result) => {
    try{
        const query = `
        DELETE FROM history WHERE historyId = $1;
        ;`

        const values = [historyId];
    
        sql.query(query,values,(err,res)=>{
            if(err){
                console.log('error: ', err);
                result(err,null);
                return;
            }
            console.log('Delete History');
            console.log(res.rows);
            result(null, res.rows);
        });
        return;
        
    }catch(error) {
        result(err,null);
    }
};

History.query = (query,result) => {
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('Query History');
        console.log(res.rows);
        result(null, res.rows);
    });
};

module.exports = History;
