const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "avion_papier",
  timezone: "Z", // Forces Node.js to use UTC!
};

const dbConnection = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};

module.exports = dbConnection;
