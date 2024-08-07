const connection = require("../connector/db");

const getCandidates = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        c.id as candidate_id, 
        c.city_id, 
        c.fio as candidate_fio, 
        c.phone, 
        c.date_test, 
        e.id as employee_id, 
        e.fio as employee_fio, 
        e.role, 
        e.efficiency, 
        e.attached_candidates_count 
      FROM 
        candidates c 
      LEFT JOIN 
        candidate_to_employee_assign a ON c.id = a.candidate_id AND c.city_id = a.city_id 
      LEFT JOIN 
        employees e ON a.employee_id = e.id 
      WHERE 
        c.date_test >= '2024-06-03' 
        OR a.employee_id IS NULL
    `;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { getCandidates };
