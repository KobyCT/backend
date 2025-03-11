const sql = require('../config/pgdb');

const Blacklist = function(blacklist){
    this.bannerId = blacklist.bannerId;
    this.bannedId = blacklist.bannedId;
};

Blacklist.getBlacklist = (result) =>{
    sql.query(`SELECT * FROM blacklist;`,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All blacklist');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Blacklist.banUser = (newBlacklist,result) =>{
    const {bannerId,bannedId} = newBlacklist;

    const query = `
    INSERT INTO blacklist (bannerId,bannedId)
    VALUES ('${bannerId}','${bannedId}')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('Add to blacklist:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Blacklist.unBanUser = (unBanedId, result) => {
    if (!unBanedId) {
        return result({ message: "Invalid bannedId" }, null);
    }

    const query = `DELETE FROM blacklist WHERE bannedId = $1`;

    sql.query(query, [unBanedId], (err, res) => {
        if (err) {
            console.log('create error: ', err);
            return result(err, null);
        }
        console.log('Remove from blacklist:', res.rowCount);
        result(null, res.rowCount);
    });
};

Blacklist.areBanned = (userId, result) => {
    if (!userId) {
        return result({ message: "Invalid bannedId" }, null);
    }

    const query = `SELECT * FROM blacklist WHERE bannedId = $1`;

    sql.query(query, [userId], (err, res) => {
        if (err) {
            console.log('create error: ', err);
            return result(err, null);
        }
        console.log('Get blacklist:', res.rowCount);
        result(null, res.rowCount);
    });
};


module.exports = Blacklist;