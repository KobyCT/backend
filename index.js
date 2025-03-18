const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const app = express();

dotenv.config({path:'./config/config.env'});

app.use(express.json());

app.use(cors());

//Cookie parser
app.use(cookieParser());

const products = require('./routes/products');
app.use('/api/products', products);

const auth = require('./routes/auth');
app.use('/api/auth', auth);

const carts = require('./routes/carts');
app.use('/api/cart', carts);

const chats = require('./routes/chats');
app.use('/api/chats', chats);

const messages = require('./routes/message');
app.use('/api/messages', messages);

const blacklist = require('./routes/blacklists');
app.use('/api/blacklist', blacklist);

const reviews = require('./routes/reviews');
app.use('/api/review', reviews);

const history = require('./routes/history');
app.use('/api/history', history);

const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    console.log(
        'Server running in ', 
        process.env.NODE_ENV,
        ' mode on port ',
        PORT
    )
);

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`);
    server.close(()=> process.exit(1));
});