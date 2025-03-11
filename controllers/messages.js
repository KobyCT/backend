const Message = require('../models/message');

exports.getMessage = async (req,res,next) =>{
    try {
            if (!req.params.chatId) {
                return res.status(400).json({ success: false, msg: 'Not have chatId params!' });
            }
    
            const chatId = req.params.chatId;

            Message.getMessage(chatId,(err,data)=>{
                if(err) res.status(400).json(err);
                res.status(201).json(data);
            });
    
        } catch (err) {
            console.error("Error:", err);
            res.status(500).json({ success: false, msg: 'Internal Server Error', error: err.message });
        }
};

exports.createMessage = async (req,res,next) =>{
    try {
            if (!req.body) {
                return res.status(400).json({ success: false, msg: 'Content cannot be empty!' });
            }
            
            const message = new Message({
                chatId: req.body.chatId,
                senderId: req.user.uid,
                text:req.body.text
            });

            Message.createMessage(message,(err,data)=>{
                if(err) res.status(400).json(err);
                res.status(201).json(data);
            });
    
        } catch (err) {
            console.error("Error:", err);
            res.status(500).json({ success: false, msg: 'Internal Server Error', error: err.message });
        }
};