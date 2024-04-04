var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shyam@2003",
  database: "priyanshu"
});

module.exports=db;