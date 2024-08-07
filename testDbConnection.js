const connection = require('./connector/db');

const testDbConnection = () => {
  const query = 'SELECT 1 + 1 AS solution';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('Query result:', results[0].solution);
    }

    connection.end((err) => {
      if (err) {
        console.error('Error closing the connection:', err);
      } else {
        console.log('Connection closed successfully.');
      }
    });
  });
};

testDbConnection();
