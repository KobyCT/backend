const sql = require('../config/pgdb');

const Message = function(message){
    this.chatId = message.chatId;
    this.senderId = message.senderId;
    this.text = message.text;
};

Message.getMessage = (chatId,result)=>{
    query = `SELECT * FROM messages WHERE chatId = ${chatId};`;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('get message:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Message.createMessage = (newMessage,result)=>{
    const {chatId,senderId,text} = newMessage;

    const query = `
    INSERT INTO chats (chatId,senderId,text)
    VALUES ('${chatId}','${senderId}','${text}')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('create message:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

module.exports = Message;