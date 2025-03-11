const {Product,Type} = require('../models/product');

exports.getAllType = async (req,res,next) => {
    Type.getAllType((err, data)=>{
        if(err)
            res.status(500).send({message: err.message || 'Some error occurred while retrieving All Type'});
        else res.status(200).json(data);
    });
};

exports.AddType = async (req,res,next) => {
    if(!req.body) {
        res.status(400).json({success: false, msg: 'Content cannot be empty!'});
    }

        const type = new Type({
            productid : req.body.productid,
            type : req.body.type,
        });

        Type.AddType(type, (err, data)=>{
            if(err)
                res.status(500).send({message: err.message || 'Some error occurred while add type'});
            else res.status(201).json(data);
        });
};

exports.deleteType = (req,res) => {
    if(!req.body) {
        res.status(400).json({success: false, msg: 'Content cannot be empty!'});
    }

        const type = new Type({
            productid : req.body.productid,
            type : req.body.type,
        });

        Type.RemoveType(type, (err, data)=>{
            if(err)
                res.status(500).send({message: err.message || 'Some error occurred while delete type'});
            else res.status(201).json(data);
        });
};



exports.getProducts = async (req, res, next) => {
    const { select, sort ,type} = req.query;
    
    const columns = select ? select.split(',').map(col => `"${col.trim()}"`).join(', ') : '*';
    
    let orderBy = 'createTime DESC';
    if (sort) {
        const [col, order] = sort.split(':');
        const validOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        orderBy = `"${col.trim()}" ${validOrder}`;
    }
    
    let query;
    if(type){
        query = `SELECT ${columns} FROM products WHERE isApprove = true AND id IN (SELECT productid FROM type WHERE type = '${type}') ORDER BY ${orderBy};`;
    }else{
        query = `SELECT ${columns} FROM products WHERE isApprove = true ORDER BY ${orderBy};`;
    }
    
    Product.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            res.status(200).json(data);
        }
    });
};

exports.getUnApproveProducts = async (req, res, next) => {
    const query = `SELECT * FROM products WHERE isApprove = false`;
    
    Product.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            res.status(200).json(data);
        }
    });
};

exports.approveProducts = async (req, res, next) => {
    const productId = req.params.id;

    const query = `UPDATE products SET isApprove= true WHERE id = ${productId}`;
    
    Product.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            res.status(200).json(data);
        }
    });
};

exports.unApproveProducts = async (req, res, next) => {
    const productId = req.params.id;

    const query = `UPDATE products SET isApprove= false WHERE id = ${productId}`;
    
    Product.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            res.status(200).json(data);
        }
    });
};


exports.getMyProducts = async (req, res, next) => {
    const query = `SELECT * FROM products WHERE sellerId = ${req.user.uid}`;
    Product.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            res.status(200).json(data);
        }
    });
};

exports.getRecommendProducts = async (req,res,next) => {
    Product.getSameProductType(req.params.id,(err, data)=>{
        if(err)
            res.status(500).send({message: err.message || 'Some error occurred while retrieving Recommend Products'});
        else res.status(200).json(data);
    });
};

exports.search = async (req, res, next) => {
    const search = req.query.q;
    
    console.log(req.query.q);
    const query = `SELECT * FROM products WHERE name ILIKE '%${search}%'`;
    
    console.log(query);
    Product.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            res.status(200).json(data);
        }
    });
};


exports.createProduct = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ success: false, msg: 'Content Cannot be empty!' });
    }

    let seller = req.user.uid; 
    if (req.user.role === 'admin' && req.body.sellerId) {
        seller = req.body.sellerId; 
    }

    const product = new Product({
        name: req.body.name,
        sellerId:seller,
        description: req.body.description.replace(/'/g, "''"), 
        price: parseFloat(req.body.price) || 0, 
        oldPrice: parseFloat(req.body.oldPrice) || 0,
        quantity: parseInt(req.body.quantity, 10) || 0,
        shippingType: req.body.shippingType.trim(),
        shippingCost: parseFloat(req.body.shippingCost) || 0,
        approveDescription: req.body.approveDescription.replace(/'/g, "''"), 
        isApprove: false,
        imageURL: req.body.imageURL
    });
    

    console.log(product);

    Product.create(product, (err, data) => {
        if (err)
            return res.status(500).send({ message: err.message || 'Some error occurred while creating Product' });
        res.status(201).json(data);
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