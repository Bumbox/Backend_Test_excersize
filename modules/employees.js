const connection = require('../connector/db');

const getEmployees = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM employees`;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { getEmployees };
