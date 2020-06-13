var mysql = require('mysql');

//Configuration Database or Multiple Database
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vue-pembelian"
});


module.exports.mysqli = db;