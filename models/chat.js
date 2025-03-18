const sql = require('../config/pgdb');

const Chat = function(chat){
    this.chatId = chat.chatId;
    this.members = chat.members;
    this.productId = chat.productId;
    this.quantity = chat.quantity;
};

Chat.getChat = (userId,result)=>{
    query = `SELECT * FROM chats WHERE '${userId}' = ANY(members);`;

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
    const {members,productId,quantity} = newChat;

    const query = `
  INSERT INTO chats (members, productId, quantity)
  VALUES ($1, $2, $3) RETURNING *;
`;

    sql.query(query, [members, productId, quantity], (err, res)=>{
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

module.exports = Chat;
