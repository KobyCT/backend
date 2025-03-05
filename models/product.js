const sql = require('../config/pgdb');

const Product = function(product){
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.quantity = product.quantity;
};

Product.getAll = (result) => {
    sql.query('SELECT * FROM products;',(err,res)=>{
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
    const {name,description,price,quantity} = newProduct;
    
    const query = `
    INSERT INTO products (name,description,price,quantity)
    VALUES ('${name}','${description}','${price}','${quantity}')
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
    const query = `DELETE FROM products WHERE id = ${id} RETURNING *;`;

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

module.exports = Product;