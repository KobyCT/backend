const Chat = require('../models/chat');

exports.createChat = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, msg: 'Content Cannot be empty!' });
        }

        const productId = req.body.productId;

        const sellerResult = await new Promise((resolve, reject) => {
            Chat.query(`SELECT sellerId FROM products WHERE id = ${productId}`, (err, data) => {
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

        const chat = new Chat({
            chatId: null,
            members: `{${String(sellerId)},${String(buyerId)}}`,
            productId: req.body.productId,
            quantity: req.body.quantity
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
    Chat.getChat(req.params.id,(err,data)=>{
        if(err) res.status(400).json(err);
        res.status(200).json(data);
    });
};

