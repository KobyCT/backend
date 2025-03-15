const History = require('../models/history');

exports.getHistory = async (req,res,next) =>{

    let query;

    if(req.user.role === 'admin'){
        query = `SELECT * FROM history`;
    }else{
        const buyerId = req.user.uid;
        query = `SELECT * FROM history WHERE buyerId = '${buyerId}'`;
    }

    History.query(query,(err,data)=>{
        if(err){
            res.status(400).json({success:false,msg:err});
            return;
        }

        res.status(200).json({success:true,data:data});
    });
};

exports.createHistory = async (req,res,next) =>{

    
    if(!req.body){
        res.status(400).send('Content cannot be empty!');
        return;
    }
    
    let buyerId = req.user.uid;
    if(req.user.role === 'admin' && req.body.buyerId){
        buyerId = req.body.buyerId;
    }
    
    try{
        const history = new History({
            buyerId : buyerId,
            productId : req.body.productId,
            paymentURL : req.body.paymentURL,
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