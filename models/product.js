const sql = require('../config/pgdb');

const Product = function(product){
    this.id = product.id;
    this.sellerId = product.sellerId;
    this.name = product.name;
    this.description = product.description;
    this.detailOneDescription = product.detailOneDescription;
    this.detailTwoDescription = product.detailTwoDescription;
    this.detailThreeDescription = product.detailThreeDescription;
    this.detailFourDescription = product.detailFourDescription;
    this.contition = product.contition;
    this.contitionDescription = product.contitionDescription;
    this.price = product.price;
    this.oldPrice = product.oldPrice;
    this.quantity = product.quantity;
    this.shippingType = product.shippingType;
    this.shippingCost = product.shippingCost;
    this.isApprove = product.isApprove;
    this.isOpen = product.isOpen;
    this.verifyImages = product.verifyImages;
    this.productImages = product.productImages;
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

Product.create = async (newProduct, result) => {
    try {
        const {
            name, sellerId, description, detailOneDescription, detailTwoDescription,
            detailThreeDescription, detailFourDescription, condition, conditionDescription, 
            price, oldPrice, quantity, shippingType, shippingCost, isApprove, isOpen, 
            imageName
        } = newProduct;

        const query = `
        INSERT INTO products (
            name, sellerId, description, detailOneDescription, detailTwoDescription,
            detailThreeDescription, detailFourDescription, condition, conditionDescription, 
            price, oldPrice, quantity, shippingType, shippingCost, isApprove, 
            isOpen, imageName
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *;
        `;

        const values = [
            name, sellerId, description, detailOneDescription, detailTwoDescription,
            detailThreeDescription, detailFourDescription, condition, conditionDescription,
            price, oldPrice || null, quantity, shippingType, shippingCost, 
            isApprove, isOpen, imageName
        ];

        const res = await sql.query(query, values);
        console.log('Created product:', res.rows[0]);
        result(null, res.rows[0]);
    } catch (err) {
        console.error('Create error:', err);
        result(err, null);
    }
};

Product.updateById = async (id, product, result) => {
    try {
        const updates = Object.keys(product)
            .filter((key) => product[key] !== undefined)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        if (!updates) {
            return result({ msg: 'no_data_to_update' }, null); 
        }

        const values = Object.values(product).filter((value) => value !== undefined);
        values.push(id); 

        const query = `UPDATE products SET ${updates} WHERE id = $${values.length} RETURNING *;`;

        const res = await sql.query(query, values);

        if (res.rowCount === 0) {
            return result({ msg: 'not_found' }, null);
        }

        console.log('Updated product:', res.rows[0]);
        result(null, res.rows[0]);
    } catch (err) {
        console.error('Update error:', err);
        result(err, null);
    }
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