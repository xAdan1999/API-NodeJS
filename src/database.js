const mysql = require('promise-mysql');
const config = require('./config');

const mysqlConnection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

const getConnection = () =>{
    return mysqlConnection;
};

module.exports = getConnection;
