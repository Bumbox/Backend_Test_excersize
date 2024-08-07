const assignCandidates = (candidates, employees) => {
  const recruiters = employees
    .filter((e) => e.role === "Recruiter")
    .sort((a, b) => b.efficiency - a.efficiency);
  const developers = employees
    .filter((e) => e.role === "Developer")
    .sort((a, b) => b.efficiency - a.efficiency);

  const recruiterAssignments = {};
  const developerAssignments = {};

  recruiters.forEach((recruiter) => {
    recruiterAssignments[recruiter.id] = [];
  });

  developers.forEach((developer) => {
    developerAssignments[developer.id] = [];
  });

  candidates.forEach((candidate) => {
    if (!candidate.employee_id) {
      if (recruiters.length > 0) {
        const recruiter = recruiters.shift();
        recruiterAssignments[recruiter.id].push(candidate);
        recruiter.attached_candidates_count += 1;
        recruiters.push(recruiter);
        recruiters.sort((a, b) => b.efficiency - a.efficiency);
      }
    } else if (candidate.role === "Recruiter") {
      if (developers.length > 0) {
        const developer = developers.shift();
        developerAssignments[developer.id].push(candidate);
        developer.attached_candidates_count += 1;
        developers.push(developer);
        developers.sort((a, b) => b.efficiency - a.efficiency);
      }
    }
  });

  return { recruiterAssignments, developerAssignments };
};

const updateDatabase = (
  recruiterAssignments,
  developerAssignments,
  connection
) => {
  const updates = [];

  Object.keys(recruiterAssignments).forEach((recruiterId) => {
    recruiterAssignments[recruiterId].forEach((candidate) => {
      updates.push(
        new Promise((resolve, reject) => {
          const query = `
            INSERT INTO candidate_to_employee_assign (candidate_id, city_id, employee_id, created_at) 
            VALUES (${candidate.candidate_id}, ${candidate.city_id}, ${recruiterId}, NOW())
            ON DUPLICATE KEY UPDATE employee_id = ${recruiterId}, created_at = NOW()
          `;
          connection.query(query, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    });
  });

  Object.keys(developerAssignments).forEach((developerId) => {
    developerAssignments[developerId].forEach((candidate) => {
      updates.push(
        new Promise((resolve, reject) => {
          const query = `
            INSERT INTO candidate_to_employee_assign (candidate_id, city_id, employee_id, created_at) 
            VALUES (${candidate.candidate_id}, ${candidate.city_id}, ${developerId}, NOW())
            ON DUPLICATE KEY UPDATE employee_id = ${developerId}, created_at = NOW()
          `;
          connection.query(query, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    });
  });

  return Promise.all(updates);
};

module.exports = { assignCandidates, updateDatabase };
