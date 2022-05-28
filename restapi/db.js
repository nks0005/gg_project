const mysql = require('mysql'); // npm install mysql

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: 'crawl'
});



exports.con = con;