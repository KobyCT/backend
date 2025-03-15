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
    this.isOpen = product.isOpen;
    this.imageURL = product.imageURL;
};

const Tag = function(tags){
    this.productid = tags.productid;
    this.tag = tags.tag;
};

Tag.getAllTag = (result) => {
    sql.query('SELECT * FROM tags;',(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All tags');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Tag.getThisProductTag = (id,result) => {
    sql.query(`SELECT DISTINCT tag FROM tags WHERE productid = ${id};`,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All tags');
        console.log(res.rows);
        result(null, res.rows);
    });
};

Tag.AddTag = (newTag, result) => {
    const { productid, tag } = newTag;

    const query = `
    INSERT INTO tags (productid, tag)
    VALUES ($1, $2)
    RETURNING *;
    `;

    const values = [productid, tag];

    sql.query(query, values, (err, res) => {
        if (err) {
            console.log('create error: ', err);
            result(err, null);
            return;
        }
        console.log('Add tag:', res.rows);
        result(null, res.rows);
    });
};


Tag.RemoveTag = (deletedTag, result) => {
    const { productid, tag } = deletedTag;
    
    const query = `
    DELETE FROM tags WHERE productid = $1 AND tag = $2 RETURNING *;
    `;

    const values = [productid, tag];

    sql.query(query, values, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        if (res.rowCount === 0) {  
            result({ kind: 'not_found' }, null);
            return;
        }

        console.log(`Deleted tag '${tag}' from productid: ${productid}`);
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
    const {
        name, sellerId, description, price, oldPrice, quantity,
        shippingType, shippingCost, approveDescription, isApprove,
        isOpen, imageURL
    } = newProduct;
    
    const query = `
    INSERT INTO products (name, sellerId, description, price, oldPrice, quantity, 
                          shippingType, shippingCost, approveDescription, isApprove, isOpen, imageURL)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
    `;

    const values = [
        name, sellerId, description, price, oldPrice, quantity,
        shippingType, shippingCost, approveDescription, isApprove,
        isOpen, imageURL
    ];

    sql.query(query, values, (err, res) => {
        if (err) {
            console.log('create error:', err);
            result(err, null);
            return;
        }
        console.log('create product:', res.rows);
        result(null, res.rows);
    });
};


Product.updateById = (id, product, result) => {
    const query = `
    UPDATE products 
    SET name = $1, sellerId = $2, description = $3, price = $4, oldPrice = $5, quantity = $6,
        shippingType = $7, shippingCost = $8, approveDescription = $9, isApprove = $10, 
        isOpen = $11, imageURL = $12
    WHERE id = $13
    RETURNING *;
    `;

    const values = [
        product.name, product.sellerId, product.description, product.price, product.oldPrice, 
        product.quantity, product.shippingType, product.shippingCost, product.approveDescription, 
        product.isApprove, product.isOpen, product.imageURL, id
    ];

    sql.query(query, values, (err, res) => {
        if (err) {
            console.log('error:', err);
            result(err, null);
            return;
        }

        if (res.rowCount === 0) {
            result({ msg: 'not_found' }, null);
            return;
        }

        console.log('update product:', res.rows);
        result(null, res.rows);
    });
};


Product.remove = (id,result) => {
    const query = `
    DELETE FROM type WHERE productid = ${id};
    DELETE FROM cart WHERE productid = ${id};
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

Product.getSameProductTag = (id,result)=>{
    const query = `SELECT DISTINCT * FROM products WHERE id != ${id} AND id IN (
SELECT DISTINCT productid FROM tags WHERE tag IN (
SELECT tag FROM tags WHERE productid = ${id} GROUP BY tag)) ORDER BY createtime DESC LIMIT 5`
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

Product.getProductCount = async (result) => {
    try {
        const totalQuery = `
            SELECT COUNT(*) AS total_products
            FROM products
            WHERE isApprove = true;
        `;
        const totalResult = await sql.query(totalQuery);
        const totalProducts = totalResult.rows[0].total_products;

        const tagQuery = `
            SELECT t.tag, COUNT(p.id) AS product_count
            FROM tags t
            LEFT JOIN products p ON p.id = t.productid
            WHERE p.isApprove = true
            GROUP BY t.tag;
        `;
        const tagResult = await sql.query(tagQuery);

        result(null, {
            totalProducts: totalProducts,
            productsPerTag: tagResult.rows
        });
    } catch (err) {
        result(err, null);
    }
};


module.exports = {Product,Tag};