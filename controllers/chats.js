const Chat = require('../models/chat');

exports.createChat = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, msg: 'Content Cannot be empty!' });
        }

        const productId = req.body.productId;

        const sellerResult = await new Promise((resolve, reject) => {
            Chat.query(`SELECT sellerId FROM products WHERE id = ${productId};`, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        console.log("sellerResult:", sellerResult);

        if (!sellerResult || sellerResult.length === 0) {
            return res.status(404).json({ success: false, msg: 'Seller not found for this product' });
        }

        const sellerId = sellerResult[0].sellerid;
        console.log("sellerId:", sellerId);

        const buyerId = req.user.uid;

        if(sellerId == buyerId) {
            return res.status(400).json({success:false,message:"Seller And Buyer are same id"});
        }

        const chat = new Chat({
            chatId: null,
            members: `{${String(sellerId)},${String(buyerId)}}`,
            productId: req.body.productId,
            quantity: req.body.quantity,
            success: false
        });

        console.log("chat:", chat);

        const chatResult = await new Promise((resolve, reject) => {
            Chat.createChat(chat, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        res.status(201).json(chatResult);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, msg: 'Internal Server Error', error: err.message });
    }
};

exports.createAdminChat = async (req, res, next) => {
    try {
        const buyerId = req.user.uid;

        const chat = new Chat({
            chatId: null,
            members: `{${String(buyerId)}}`,
            productId: '0',
            quantity: '0',
            success: false
        });

        console.log("chat:", chat);

        const chatResult = await new Promise((resolve, reject) => {
            Chat.createChat(chat, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        res.status(201).json(chatResult);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, msg: 'Internal Server Error', error: err.message });
    }
};

exports.getChats = async (req,res,next) => {
    Chat.getChat(req.params.id,req.user.role,(err,data)=>{
        if(err) res.status(400).json(err);
        res.status(200).json(data);
    });
};

exports.getChat = async (req,res,next) => {
    const query = `SELECT * FROM chats WHERE chatId = '${req.params.id} AND success = false;'`;
    Chat.query(query,(err,data)=>{
        if(err) res.status(400).json(err);
        res.status(200).json(data);
    });
};

exports.successChat = async (req,res,next) => {
    const query = `UPDATE chats SET success = true WHERE chatId = '${req.params.id}';`;
    console.log(req.params.id);
    Chat.query(query,(err,data)=>{
        if(err) res.status(400).json(err);
        res.status(200).json(data);
    });
};

exports.deleteChats = async (req, res, next) => {
    const chatId = req.params.id;
    const userId = req.user.uid;

    try {
        if (req.user.role !== "admin") {
            const checkQuery = `SELECT * FROM chats WHERE chatId = '${chatId}' AND '${userId}' = ANY(members);`;

            const checkResult = await new Promise((resolve, reject) => {
                Chat.query(checkQuery, (err, rows) => {
                    if (err) return reject(err);
                    if (!rows || rows.length === 0) {
                        return reject({
                            status: 400,
                            message: "Not found Chat or you are not a member in this chat",
                        });
                    }
                    resolve(rows);
                });
            });

            console.log("Chat found:", checkResult);
        }

        const deleteQuery = `
            DELETE FROM messages WHERE chatId = '${chatId}'; 
            DELETE FROM chats WHERE chatId = '${chatId}' RETURNING *;
        `;

        const deleteResult = await new Promise((resolve, reject) => {
            Chat.query(deleteQuery, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        res.status(200).json({ success: true, data: deleteResult });

    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(400).json({ success: false, error: err });
    }
};


