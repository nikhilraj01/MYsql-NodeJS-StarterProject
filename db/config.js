var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "emp_data",
});

connection.connect();

module.exports = connection;
