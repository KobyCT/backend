const Product = require('../models/product');

exports.getProducts = async (req,res,next) => {
    Product.getAll((err, data)=>{
        if(err)
            res.status(500).send({message: err.message || 'Some error occurred while retrieving All Products'});
        else res.status(200).json(data);
    });
};

exports.createProduct = async (req,res,next) => {
    if(!req.body) {
        res.status(400).json({success: false, msg: 'Cannot be empty!'});
    }

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
        });

        Product.create(product, (err, data)=>{
            if(err)
                res.status(500).send({message: err.message || 'Some error occurred while create Product'});
            else res.status(201).json(data);
        });
};

exports.updateProduct = (req, res) => {
    //Validate Request
    if(!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        });
    }

    console.log(req.body);

    Product.updateById(req.params.id, new Product(req.body), (err, data) => {
        if(err) {
            if(err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found Product with id ${req.params.id}.`,
                });
            } else {
                res.status(500).send({
                    message: 'Error updating Product with id' + req.params.id,
                });
            }
        } else res.status(200).json(data);
    });
};

exports.deleteProduct = (req,res) => {
    Product.remove(req.params.id, (err,data)=>{
        if(err) {
            if(err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found Product with id ${req.params.id}.`,
                });
            } else {
                res.status(500).send({
                    message: 'Could not delete Product with id' + req.params.id,
                });
            }
        } else res.status(200).json({
            success: true,
            data: {}
        });
    });
};