const { query } = require('express');
const {Pool} = require('pg');

var connection= new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});

async function deleteAllTable() {
    
}

async function createProductsTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255),
            price NUMERIC(10,2),
            quantity NUMERIC
        );
        `;

        await connection.query(query);
        console.log('Products table created');
    }catch(err){
        console.error(err);
        console.error('Products table creation failed');
    }  
}
createProductsTable();

async function createUsersTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            uid VARCHAR(255) UNIQUE PRIMARY KEY ,
            firstNameTH VARCHAR(255) NOT NULL,
            firstNameEN VARCHAR(255) NOT NULL,
            lastNameTH VARCHAR(255) NOT NULL,
            lastNameEN VARCHAR(255) NOT NULL,
            facultyId VARCHAR(255),
            facultyNameTH VARCHAR(255),
            facultyNameEN VARCHAR(255),
            studentYear VARCHAR(255),
            studentId VARCHAR(255),
            role VARCHAR(255) DEFAULT 'user'
        );
        `;

        await connection.query(query);
        console.log('Users table created');
    }catch(err){
        console.error(err);
        console.error('Users table creation failed');
    }  
}
createUsersTable();

async function createSellTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS sell (
            sellerId VARCHAR(255),
            productId SERIAL,
            FOREIGN KEY (sellerId) REFERENCES users(uid),
            FOREIGN KEY (productId) REFERENCES products(id)
        );
        `;

        await connection.query(query);
        console.log('Sell table created');
    }catch(err){
        console.error(err);
        console.error('Sell table creation failed');
    }  
}
createSellTable() ;

async function createCartTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS cart (
            buyerId VARCHAR(255),
            productId SERIAL,
            quantity NUMERIC,
            addtime TIMESTAMP DEFAULT now(),
            FOREIGN KEY (buyerId) REFERENCES users(uid),
            FOREIGN KEY (productId) REFERENCES products(id)
            
        );
        `;

        await connection.query(query);
        console.log('Cart table created');
    }catch(err){
        console.error(err);
        console.error('Cart table creation failed');
    }  
}
createCartTable();

async function createTypeTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS type(
            productId SERIAL,
            type VARCHAR(255),
            FOREIGN KEY (productId) REFERENCES products(id)
        );
        `;

        await connection.query(query);
        console.log('Type table created');
    }catch(err){
        console.error(err);
        console.error('Type table creation failed');
    }  
}
createTypeTable();



module.exports = connection;