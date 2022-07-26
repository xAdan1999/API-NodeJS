require('dotenv').config();

module.exports = {
    host: process.env.HOST || '',
    user: process.env.USER || '',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || '',
    key: process.env.KEY || '',
    encryptkey: process.env. ENCRYPTKEY || ''
};