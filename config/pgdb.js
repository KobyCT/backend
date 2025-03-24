const { query } = require('express');
const { Pool } = require('pg');

var connection= new Pool({
   
    connectionString: process.env.DATABASE_URL,
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
            success BOOLEAN,
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

    INSERT INTO users (uid, firstNameTH, firstNameEN, lastNameTH, lastNameEN, role)
    SELECT '0', 'CUrecommerce', 'CUrecommerce', 'CUrecommerce', 'CUrecommerce', 'admin'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE uid = '0');

    INSERT INTO products (id, sellerId, name, description, price, quantity, isApprove, isOpen, verifyImages, productImages)
    SELECT 0, '0', 'Admin', 'Admin', 0, 0, TRUE, FALSE, ARRAY[]::TEXT[], ARRAY[]::TEXT[]
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE id = 0);

        `; 

        await connection.query(query);
        console.log('Index created');
    } catch (err) {
        console.error(err);
        console.error('Index creation failed');
    }  
}

createIndex();

async function createTrigger() {
    try {
        const query = `
    CREATE TABLE IF NOT EXISTS deleted_products_log (
        id SERIAL PRIMARY KEY,
        product_id INT,
        sellerId VARCHAR(255),
        name VARCHAR(255),
        deleted_at TIMESTAMP DEFAULT NOW()
    );

    CREATE OR REPLACE FUNCTION log_deleted_product()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO deleted_products_log (product_id, sellerId, name, deleted_at)
        VALUES (OLD.id, OLD.sellerId, OLD.name, NOW());

        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER before_delete_product
    BEFORE DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_deleted_product();

    CREATE TABLE IF NOT EXISTS deleted_chats_log (
        id SERIAL PRIMARY KEY,
        chatId INT,
        members TEXT[],
        productId INTEGER,
        quantity NUMERIC,
        success BOOLEAN,
        deleted_at TIMESTAMP DEFAULT NOW()
    );

    CREATE OR REPLACE FUNCTION log_deleted_chat()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO deleted_chats_log (chatId, members, productId, quantity, success, deleted_at)
        VALUES (OLD.chatId, OLD.members, OLD.productId, OLD.quantity, OLD.success, NOW());

        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER before_delete_chat
    BEFORE DELETE ON chats
    FOR EACH ROW
    EXECUTE FUNCTION log_deleted_chat();

    CREATE TABLE IF NOT EXISTS deleted_messages_log (
        id SERIAL PRIMARY KEY,
        messageId INT,
        chatId INT,
        senderId VARCHAR(255),
        text VARCHAR(255),
        deleted_at TIMESTAMP DEFAULT NOW()
    );

    CREATE OR REPLACE FUNCTION log_deleted_message()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO deleted_messages_log (messageId, chatId, senderId, text, deleted_at)
        VALUES (OLD.messageId, OLD.chatId, OLD.senderId, OLD.text, NOW());

        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER before_delete_message
    BEFORE DELETE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION log_deleted_message();


        `; 

        await connection.query(query);
        console.log('Trigger created');
    } catch (err) {
        console.error(err);
        console.error('Trigger creation failed');
    }  
}

createTrigger();

module.exports = connection;
