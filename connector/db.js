const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "81.31.247.100",
  port: "3306",
  user: "QfaOtX",
  password: "vDESLaSNaNlGMcMB",
  database: "testdatabase",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

module.exports = connection;
