const { query } = require('express');
const { Pool } = require('pg');

var connection= new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});

async function createUsersTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            uid VARCHAR(255) UNIQUE PRIMARY KEY,
            firstNameTH VARCHAR(255) NOT NULL,
            firstNameEN VARCHAR(255) NOT NULL,
            lastNameTH VARCHAR(255) NOT NULL,
            lastNameEN VARCHAR(255) NOT NULL,
            facultyId VARCHAR(255),
            facultyNameTH VARCHAR(255),
            facultyNameEN VARCHAR(255),
            studentYear VARCHAR(255),
            studentId VARCHAR(255),
            color VARCHAR(255),
            role VARCHAR(255) DEFAULT 'acceptuser'
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

async function createProductsTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            sellerId VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255),
            detailOneDescription VARCHAR(255),
            detailTwoDescription VARCHAR(255),
            detailThreeDescription VARCHAR(255),
            detailFourDescription VARCHAR(255),
            condition VARCHAR(255),
            conditionDescription VARCHAR(255),
            price NUMERIC(10,2),
            oldPrice NUMERIC(10,2),
            quantity NUMERIC,
            shippingType VARCHAR(255),
            shippingCost NUMERIC(10,2),
            isApprove BOOLEAN,
            isOpen BOOLEAN,
            verifyImages TEXT[],
            productImages TEXT[],
            createTime BIGINT DEFAULT EXTRACT(EPOCH FROM now()), 
            FOREIGN KEY (sellerId) REFERENCES users(uid)
        );
        `; 

        await connection.query(query);
        console.log('Products table created');
    } catch (err) {
        console.error(err);
        console.error('Products table creation failed');
    }  
}

createProductsTable();




async function createCartTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS cart (
            buyerId VARCHAR(255),
            productId SERIAL,
            quantity NUMERIC,
            addtime TIMESTAMP DEFAULT now(),
            FOREIGN KEY (buyerId) REFERENCES users(uid),
            FOREIGN KEY (productId) REFERENCES products(id),
            PRIMARY KEY (buyerId,productId)
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

async function createTagTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS tags(
            productId SERIAL,
            tag VARCHAR(255),
            FOREIGN KEY (productId) REFERENCES products(id),
			PRIMARY KEY (productId,tag)
        );
        `;

        await connection.query(query);
        console.log('Tag table created');
    }catch(err){
        console.error(err);
        console.error('Tag table creation failed');
    }  
}
createTagTable();

async function createChatTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS chats(
            chatId SERIAL,
            members TEXT[] NOT NULL,
            productId INTEGER,
            quantity NUMERIC,
            createTime TIMESTAMP DEFAULT now(),
            FOREIGN KEY (productId) REFERENCES products(id),
            PRIMARY KEY(chatId)
        );
        `;

        await connection.query(query);
        console.log('Chat table created');
    }catch(err){
        console.error(err);
        console.error('Chat table creation failed');
    }  
}
createChatTable();

async function createMessageTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS messages(
            messageId SERIAL PRIMARY KEY,
            chatId INTEGER REFERENCES chats(chatId),
            senderId VARCHAR(255),
            text VARCHAR(255),
            sendTime TIMESTAMP DEFAULT now()
        );
        `;

        await connection.query(query);
        console.log('Message table created');
    }catch(err){
        console.error(err);
        console.error('Message table creation failed');
    }  
}
createMessageTable();

async function createBlacklistTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS blacklist(
            bannerId VARCHAR(255),
            bannedId VARCHAR(255),
            banTime TIMESTAMP DEFAULT now()
        );
        `;

        await connection.query(query);
        console.log('Blacklist table created');
    }catch(err){
        console.error(err);
        console.error('Blacklist table creation failed');
    }  
}
createBlacklistTable();

async function createReviewTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS reviews(
            reviewId SERIAL,  
            sellerId VARCHAR(255),
            reviewerId VARCHAR(255),
            score NUMERIC,
            comment VARCHAR(255),
            FOREIGN KEY (sellerId) REFERENCES users(uid),
            FOREIGN KEY (reviewerId) REFERENCES users(uid),
            reviewTime TIMESTAMP DEFAULT now()
        );
        `;

        await connection.query(query);
        console.log('Review table created');
    }catch(err){
        console.error(err);
        console.error('Review table creation failed');
    }  
}
createReviewTable();

async function createHistoryTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS history(
            historyId SERIAL PRIMARY KEY,
            buyerId VARCHAR(255),
            productId SERIAL,
            paymentURL VARCHAR(255),
            amount NUMERIC(10,2),
            quantity NUMERIC,
            FOREIGN KEY (buyerId) REFERENCES users(uid),
            FOREIGN KEY (productId) REFERENCES products(id),
            buyTime TIMESTAMP DEFAULT now()
        );
        `;

        await connection.query(query);
        console.log('History table created');
    }catch(err){
        console.error(err);
        console.error('History table creation failed');
    }  
}
createHistoryTable();

async function createIndex() {
    try {
        const query = `
    CREATE INDEX IF NOT EXISTS idx_products_isapprove ON products (isApprove);
    CREATE INDEX IF NOT EXISTS idx_products_sellerid ON products (sellerId);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
    CREATE INDEX IF NOT EXISTS idx_tags_productid_tag ON tags (productid, tag);
        `; 

        await connection.query(query);
        console.log('Index created');
    } catch (err) {
        console.error(err);
        console.error('Index creation failed');
    }  
}

createIndex();

module.exports = connection;