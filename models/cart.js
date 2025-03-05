const sql = require('../config/pgdb');
const { deleteProduct } = require('../controllers/products');

const Cart = function(cart){
    this.buyerId = cart.buyerId;
    this.productId = cart.productId;
    this.quantity = cart.quantity;
};

Cart.getCart = (buyerId,result) =>{
    sql.query(`SELECT * FROM cart where buyerId = '${buyerId}';`,(err,res)=>{
        if(err){
            console.log('error: ', err);
            result(err,null);
            return;
        }
        console.log('All products in cart');
        console.log(res.rows);
        result(null, res.rows);
    });
};


Cart.addToCart = async (newProductToCart, result) => {
    try {
        const { buyerId, productId, quantity } = newProductToCart;
        const parsedQuantity = Number(quantity); // ใช้ Number() แทน parseInt()

        if (isNaN(parsedQuantity)) {
            throw new Error("Invalid quantity: not a number");
        }

        const selectQuery = `SELECT * FROM cart WHERE productId = $1 AND buyerId = $2;`;
        const selectResult = await sql.query(selectQuery, [productId, buyerId]);

        let productQuantity;
        let query;
        let queryParams;

        if (selectResult.rowCount === 0) {
            // ไม่พบสินค้าใน cart -> INSERT
            productQuantity = parsedQuantity;
            query = `INSERT INTO cart (buyerId, productId, quantity) VALUES ($1, $2, $3) RETURNING *;`;
            queryParams = [buyerId, productId, productQuantity];
        } else {
            // พบสินค้าแล้ว -> UPDATE
            const currentQuantity = Number(selectResult.rows[0].quantity); // แปลงเป็นตัวเลขก่อนบวก
            productQuantity = currentQuantity + parsedQuantity;
            query = `UPDATE cart SET quantity = $1 WHERE productId = $2 AND buyerId = $3 RETURNING *;`;
            queryParams = [productQuantity, productId, buyerId];
        }

        console.log(`Executing query: ${query} with params:`, queryParams);

        const updateResult = await sql.query(query, queryParams);
        console.log('Updated cart:', updateResult.rows);
        result(null, updateResult.rows);
    } catch (err) {
        console.error('Error in addToCart:', err);
        result(err, null);
    }
};


Cart.deleteFromCart = async (deleteProduct, result) => {
    try {
        const { buyerId, productId, quantity } = deleteProduct;

        if (quantity < 0) {
            throw new Error("Quantity must be a positive number");
        }

        // ดึงข้อมูลสินค้าจาก cart
        const selectQuery = `SELECT * FROM cart WHERE productId = $1 AND buyerId = $2;`;
        const selectResult = await sql.query(selectQuery, [productId, buyerId]);

        if (selectResult.rowCount === 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        const productQuantity = Number(selectResult.rows[0].quantity);

        let query;
        let queryParams;

        if (productQuantity <= quantity) {
            // ถ้าจำนวนในตะกร้าน้อยกว่าหรือเท่ากับจำนวนที่ต้องการลบ -> ลบออกทั้งหมด
            query = `DELETE FROM cart WHERE productId = $1 AND buyerId = $2 RETURNING *;`;
            queryParams = [productId, buyerId];
        } else {
            // ถ้ายังมีสินค้าคงเหลือ -> อัปเดตจำนวน
            const newQuantity = productQuantity - quantity;
            query = `UPDATE cart SET quantity = $1 WHERE productId = $2 AND buyerId = $3 RETURNING *;`;
            queryParams = [newQuantity, productId, buyerId];
        }

        const updateResult = await sql.query(query, queryParams);

        console.log("Updated cart:", updateResult.rows);
        result(null, updateResult.rows);
    } catch (err) {
        console.error("Error in deleteFromCart:", err);
        result(err, null);
    }
};



module.exports = Cart;