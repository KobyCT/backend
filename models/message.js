const sql = require('../config/pgdb');
const { query } = require('./chat');

const Message = function(message){
    this.chatId = message.chatId;
    this.senderId = message.senderId;
    this.text = message.text;
};

Message.getMessage = (chatId,result)=>{
    const query = `SELECT * FROM messages WHERE chatId = ${chatId};`;

    console.log(query);

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('get message error: ',err);
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
    INSERT INTO messages (chatId,senderId,text)
    VALUES ('${chatId}','${senderId}','${text}')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create message error: ',err);
            result(err,null);
            return;
        }
        console.log('create message:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

module.exports = Message;