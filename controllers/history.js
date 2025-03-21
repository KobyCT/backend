const History = require('../models/history');
const { uploadFile , deleteFile , getObjectSignedUrl}= require('./s3.js');
const crypto = require('crypto');
const sharp = require('sharp');

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

exports.getHistory = async (req,res,next) =>{

    let query;

    if(req.user.role === 'admin'){
        query = `SELECT * FROM history`;
    }else{
        const buyerId = req.user.uid;
        query = `SELECT * FROM history WHERE buyerId = '${buyerId}'`;
    }

    History.query(query, async (err,data)=>{
        if(err){
            res.status(400).json({success:false,msg:err});
            return;
        }else{
            try{
                for (let history of data) {
                    const url = await getObjectSignedUrl(history.paymenturl);
                    history.paymentImg = url;
                }
                
                return res.status(200).json({success:true,data:data});
            }catch(error){
                return res.status(400).json({success:false,error:error});
            }
        }
    });
};

exports.createHistory = async (req,res,next) =>{
    console.log("Uploaded File:", req.file); 
    console.log("Request Body:", req.body);
    if(!req.body){
        res.status(400).send('Content cannot be empty!');
        return;
    }
    
    let buyerId = req.user.uid;
    if(req.user.role === 'admin' && req.body.buyerId){
        buyerId = req.body.buyerId;
    }

    const verifyFiles = req.file;
    
    const imageName = generateFileName();
    const fileBuffer = await sharp(verifyFiles.buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer();
    
    await uploadFile(fileBuffer, imageName, verifyFiles.mimetype);
    
    
    try{
        const history = new History({
            buyerId : buyerId,
            productId : req.body.productId,
            paymentURL : imageName,
            amount : req.body.amount,
            quantity : req.body.quantity
        });
        
        console.log(history);

        History.createHistory(history,(err,data)=>{
            if(err){
                res.status(400).json({success:false,msg:err});
                return;
            }
    
            res.status(201).json({success:true,data:data});
        });

    }catch(error){
        res.status(400).json({success:false,msg:error});
    }
};

exports.updateHistory = async (req,res,next) =>{

    if(!req.body||!req.params.id){
        res.status(400).send('Content and Parameter cannot be empty!');
        return;
    }

    let buyerId = req.user.uid;
    if(req.user.role === 'admin' && req.body.buyerId){
        buyerId = req.body.buyerId;
    }

    try{
        const findHistory = await new Promise((resolve, reject) => {
            History.query(`SELECT * FROM history WHERE historyId = ${req.params.id}`,(err,data)=>{
                if(err) return reject(err)
                resolve(data)
            });
        });

        if(!findHistory){
            return res.status(404).json({ success: false, message: 'History not found' });
        }

        const history = new History({
            buyerId : buyerId,
            productId : req.body.productId,
            paymentURL : req.body.paymentURL,
            amount : req.body.amount,
            quantity : req.body.quantity
        });
    
        History.updateHistory(history,req.params.id,(err,data)=>{
            if(err){
                res.status(400).json({success:false,msg:err});
                return;
            }
    
            res.status(200).json({success:true,data:data});
        });

    }catch(error){
        res.status(400).json({success:false,msg:error});
    }
};

exports.deleteHistory = async (req,res,next) =>{

    if(!req.params.id){
        res.status(400).send('Id cannot be empty!');
        return;
    }

    try{
        History.deleteHistory(req.params.id,(err,data)=>{
            if(err){
                res.status(400).json({success:false,msg:err});
                return;
            }

            res.status(200).json({success:true,data:data});
        });

    }catch(error){
        res.status(400).json({success:false,msg:error});
    }
};

exports.getWithBuyerProduct = async (req,res,next) => {
    const buyerId = req.user.uid;

    if(!req.params.id){
        return res.status(404).json({success:false,message:"ID not found!!"});
    }
    const productId = req.params.id;

    const query = `SELECT * FROM history WHERE buyerId = '${buyerId}' AND productId = '${productId}' ;`;

    History.query(query,(err,data)=>{
        if(err){
            return res.status(400).json({success:false,err:err});
        }

        return res.status(200).json({success:true,data:data});
    });

}