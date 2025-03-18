const {Product,Tag} = require('../models/product');
const { uploadFile , deleteFile , getObjectSignedUrl}= require('./s3.js');
const crypto = require('crypto');
const sharp = require('sharp');

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

exports.getAllTag = async (req,res,next) => {
    Tag.getAllTag((err, data)=>{
        if(err)
            res.status(500).send({message: err.message || 'Some error occurred while retrieving All Tag'});
        else res.status(200).json(data);
    });
};

exports.AddTag = async (req,res,next) => {
    if(!req.body) {
        res.status(400).json({success: false, msg: 'Content cannot be empty!'});
    }

        const tag = new Tag({
            productid : req.body.productid,
            tag : req.body.tag,
        });

        Tag.AddTag(tag, (err, data)=>{
            if(err)
                res.status(500).send({message: err.message || 'Some error occurred while add Tag'});
            else res.status(201).json(data);
        });
};

exports.deleteTag = (req,res) => {
    if (!req.body || !req.body.productid || !req.body.tag) {
        return res.status(400).json({ success: false, msg: 'Missing productid or tag' });
    }
    
    const tag = new Tag({
        productid : parseInt(req.body.productid),
        tag : req.body.tag,
    });

    console.log(tag);

    Tag.RemoveTag(tag, (err, data)=>{
       if(err) {
           return res.status(500).send({message: err.message || 'Some error occurred while delete tag'});
       }
        res.status(200).json(data);
    });
};



exports.getProducts = async (req, res, next) => {
    const { select, sort, tag, page = 1, limit = 10, time } = req.query;

    const columns = select ? select.split(',').map(col => `"${col.trim()}"`).join(', ') : '*';

    let orderBy = 'createTime DESC';
    if (sort) {
        const [col, order] = sort.split(':');
        const validOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        orderBy = `"${col.trim()}" ${validOrder}`;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let tagFilter = '';
    if (tag) {
        const tagList = tag.split(',').map(t => `'${t.trim()}'`).join(', ');
        tagFilter = `AND id IN (SELECT productid FROM tags WHERE tag IN (${tagList}))`;
    }

    let timeFilter = '';
    if (time) {
        timeFilter = `AND createTime < ${time}`; 
    }

    const query = `
        SELECT ${columns} FROM products 
        WHERE isApprove = true ${tagFilter} ${timeFilter}
        ORDER BY ${orderBy}
        LIMIT ${limit} OFFSET ${offset};
    `;

    console.log(query);

    Product.query(query, async (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            for (let product of data) {
                product.verifyImageUrls = []; 
                product.productImageUrls = []; 
            
                for (let image of product.verifyimages) {
                    const url = await getObjectSignedUrl(image);
                    product.verifyImageUrls.push(url);
                }
            
                for (let image of product.productimages) {
                    const url = await getObjectSignedUrl(image);
                    product.productImageUrls.push(url);
                }
            }
            
            res.status(200).json(data);
        }
    });
};


exports.getUnApproveProducts = async (req, res, next) => {
    const query = `SELECT * FROM products WHERE isApprove = false ORDER BY id ASC`;
    
    Product.query(query,async (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            for (let product of data) {
                product.verifyImageUrls = []; 
                product.productImageUrls = []; 
            
                for (let image of product.verifyimages) {
                    const url = await getObjectSignedUrl(image);
                    product.verifyImageUrls.push(url);
                }
            
                for (let image of product.productimages) {
                    const url = await getObjectSignedUrl(image);
                    product.productImageUrls.push(url);
                }
            }
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
    Product.query(query, async (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Error retrieving products' });
        } else {
            for (let product of data) {
                product.verifyImageUrls = []; 
                product.productImageUrls = []; 
            
                for (let image of product.verifyimages) {
                    const url = await getObjectSignedUrl(image);
                    product.verifyImageUrls.push(url);
                }
            
                for (let image of product.productimages) {
                    const url = await getObjectSignedUrl(image);
                    product.productImageUrls.push(url);
                }
            }
            res.status(200).json(data);
        }
    });
};

exports.getRecommendProducts = async (req,res,next) => {
    Product.getSameProductTag(req.params.id,(err, data)=>{
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

    try {
        let seller = req.user.uid;
        if (req.user.role === 'admin' && req.body.sellerId) {
            seller = req.body.sellerId;
        }

        let open = req.body.isOpen === "true";

        const verifyFiles = req.files.verifyImages || [];
        const productFiles = req.files.productImages || [];

        let verifyImageNames = [];
        let productImageNames = [];

        for (const file of verifyFiles) {
            const imageName = generateFileName();
            const fileBuffer = await sharp(file.buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

            await uploadFile(fileBuffer, imageName, file.mimetype);
            verifyImageNames.push(imageName);
        }

        for (const file of productFiles) {
            const imageName = generateFileName();
            const fileBuffer = await sharp(file.buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

            await uploadFile(fileBuffer, imageName, file.mimetype);
            productImageNames.push(imageName);
        }

        const product = {
            name: req.body.name?.trim() || '',
            sellerId: seller,
            description: req.body.description?.replace(/'/g, "''") || '',
            detailOneDescription: req.body.detailOneDescription?.trim() || '',
            detailTwoDescription: req.body.detailTwoDescription?.trim() || '',
            detailThreeDescription: req.body.detailThreeDescription?.trim() || '',
            detailFourDescription: req.body.detailFourDescription?.trim() || '',
            condition: req.body.condition?.trim() || '',
            conditionDescription: req.body.conditionDescription?.trim() || '',
            price: parseFloat(req.body.price) || 0,
            oldPrice: parseFloat(req.body.oldPrice) || 0,
            quantity: parseInt(req.body.quantity, 10) || 0,
            shippingType: req.body.shippingType?.trim() || '',
            shippingCost: parseFloat(req.body.shippingCost) || 0,
            isApprove: false,
            isOpen: open,
            verifyImages: verifyImageNames, 
            productImages: productImageNames, 
        };

        console.log(product);

        Product.create(product, (err, data) => {
            if (err) {
                return res.status(500).send({ message: err.message || 'Some error occurred while creating Product' });
            }
            res.status(201).json(data);
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};




exports.updateProduct = (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: 'Content can not be empty!',
        });
    }

    
    if(!req.body.sellerId || req.user.role === 'acceptuser') req.body.sellerId = req.user.uid;
    
    console.log(req.body);

    Product.updateById(req.params.id, req.body, (err, data) => {
        if (err) {
            if (err.msg === 'not_found') { 
                return res.status(404).send({
                    message: `Not found Product with id ${req.params.id}.`,
                });
            } else {
                return res.status(500).send({
                    message: `Error updating Product with id ${req.params.id}`,
                    error: err,
                });
            }
        } 
        res.status(200).json(data);
    });
};


exports.deleteProduct = (req,res) => {
    Product.remove(req.params.id, async (err,data)=>{
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
        } else {
            await deleteFile(data.imageName);
            res.status(200).json({
                success: true,
                data: data
            });
        }
    });
};

exports.getProductCount = async (req, res) => {
    Product.getProductCount((err,data)=>{
        if(err){
            console.log(err);
            return res.status(400).json({success:false,massage:"Some error while count product"});
        }else{
            res.status(200).json({success:true,data:data});
        }
    });
};
