const sql = require('../config/pgdb');

const Chat = function(chat){
    this.chatId = chat.chatId;
    this.members = chat.members;
    this.productId = chat.productId;
    this.quantity = chat.quantity;
    this.success = chat.success;
};

Chat.getChat = (userId,result)=>{
    query = `SELECT * FROM chats WHERE '${userId}' = ANY(members) AND success = false;`;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('get chat error: ',err);
            result(err,null);
            return;
        }
        console.log('get chat:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Chat.createChat = (newChat,result) =>{
    const {members,productId,quantity,success} = newChat;

    const query = `
  INSERT INTO chats (members, productId, quantity, success)
  VALUES ($1, $2, $3, $4) RETURNING *;
`;

    sql.query(query, [members, productId, quantity , success], (err, res)=>{
        if(err) {
            console.log('create chat error: ',err);
            result(err,null);
            return;
        }
        console.log('create chat:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Chat.query = (query,result) => {
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All chat');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Chat.count = (userId,result) => {
    const query = `SELECT count(*) as TOTAL FROM chats WHERE '${userId}' = ANY(members) AND success = false; `;
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All chat');
        console.log(res.rows[0].total);
        result(null, res.rows[0].total);
    });
};

module.exports = Chat;
