const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Raunit@0730#",   // same as Workbench
  database: "quiz_app",
});

module.exports = db;