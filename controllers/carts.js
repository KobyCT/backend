const Cart = require('../models/cart');

exports.myCart = async (req,res,next) => {

    await Cart.getCart(req.user.uid,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message: err});
        }else res.status(200).json({success:true,data: data});
    });
};

exports.addToCart = async (req,res,next) => {
    //Validate Request
    if(!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
    }
    
    console.log(req.body);

    const addedProduct =  {
        buyerId : req.user.uid,
        productId : req.params.productId,
        quantity : req.body.quantity
    };

    await Cart.addToCart(addedProduct,(err,data)=>{
        if(err){
            res.status(400).json({success:false,message:err});
        }else res.status(201).json({success:true,data:data});
    });

    
};

exports.editCart = async (req,res,next) => {
    //Validate Request
    if(!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
    }
    
    console.log(req.body);

    const editProduct =  {
        buyerId : req.user.uid,
        productId : req.params.productId,
        quantity : req.body.quantity
    };

    await Cart.deleteFromCart(editProduct,(err,data)=>{

        if(err) {
            if(err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found product in cart with id ${req.params.productId}.`,
                });
            } else {
                res.status(500).send({
                    message: 'Could not edit product in cart with id' + req.params.productId,
                });
            }
        } else res.status(200).json({
            success: true,
            data: data
        });
    });
};