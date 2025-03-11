const sql = require('../config/pgdb');

const Product = function(product){
    this.id = product.id;
    this.sellerId = product.sellerId;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.oldPrice = product.oldPrice;
    this.quantity = product.quantity;
    this.shippingType = product.shippingType;
    this.shippingCost = product.shippingCost;
    this.approveDescription = product.approveDescription;
    this.isApprove = product.isApprove;
    this.imageURL = product.imageURL;
};

const Type = function(type){
    this.productid = type.productid;
    this.type = type.type;
};

Type.getAllType = (result) => {
    sql.query('SELECT * FROM type;',(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All type');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Type.getThisProductType = (id,result) => {
    sql.query(`SELECT DISTINCT type FROM type WHERE productid = ${id};`,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All type');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Type.AddType = (newType,result) => {
    const {productid,type} = newType;
    
    const query = `
    INSERT INTO type (productid,type)
    VALUES ('${productid}','${type}')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('Add type:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Type.RemoveType = (deletedType,result) => {
    const {productid,type} = deletedType;
    
    const query = `
    DELETE FROM type WHERE productid = ${productid} AND type = '${type}' RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err){
            console.log('error: ',err);
            result(null, err);
            return;
        }
        if(res.affectedRows == 0){
            result({kind:'not_found'},null);
            return;
        }

        console.log(`delete ${type} type in productid: `, productid);
        result(null, res.rows);
    });
};

Product.query = (query,result) => {
    sql.query(query,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All products');
        console.log(res.rows);
        result(null, res.rows);
    });
};


Product.create = (newProduct, result) => {
    const {name,sellerId,description,price,oldPrice,quantity,shippingType,shippingCost,approveDescription,isApprove,imageURL} = newProduct;
    
    const query = `
    INSERT INTO products (name,sellerId,description,price,oldPrice,quantity,shippingType,shippingCost,approveDescription,isApprove,imageURL)
    VALUES ('${name}','${sellerId}','${description}','${price}','${oldPrice}','${quantity}','${shippingType}','${shippingCost}','${approveDescription}','${isApprove}','${imageURL}')
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('create error: ',err);
            result(err,null);
            return;
        }
        console.log('create product:')
        console.log(res.rows);
        result(null, res.rows);
    });
};

Product.updateById = (id, product, result) => {
    const query = `UPDATE products SET name = '${product.name}' , description = '${product.description}',
    price = ${product.price}, quantity = ${product.quantity} WHERE id = ${id}
    RETURNING *;
    `;

    sql.query(query, (err, res)=>{
        if(err) {
            console.log('error: ', err);
            result(null,err);
            return;
        }

        if(res.affectedRows == 0){
            result({msg:'not_found'}, null);
            return;
        }

        console.log('update product: ',res.rows);
        result(null, res.rows);
    });
};

Product.remove = (id,result) => {
    const query = `
    DELETE FROM type WHERE productid = ${id};
    DELETE FROM products WHERE id = ${id} RETURNING *;`;

    sql.query(query, (err, res)=>{
        if(err){
            console.log('error: ',err);
            result(null, err);
            return;
        }
        if(res.affectedRows == 0){
            result({kind:'not_found'},null);
            return;
        }

        console.log('delete product with id: ', id);
        result(null, res.rows);
    });
};

Product.getSameProductType = (id,result)=>{
    const query = `SELECT DISTINCT * FROM products WHERE id != ${id} AND id IN (
SELECT DISTINCT productid FROM type WHERE type IN (
SELECT type FROM type WHERE productid = ${id} GROUP BY type)) ORDER BY createtime DESC LIMIT 5`
    sql.query(query, (err, res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('Product with same type');
        console.log(res.rows);
        result(null, res.rows);
    });
};

module.exports = {Product,Type};