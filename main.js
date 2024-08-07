const { getCandidates } = require('./modules/candidates');
const { getEmployees } = require('./modules/employees');
const { assignCandidates, updateDatabase } = require('./modules/assign');
const { generateReports } = require('./modules/reports');
const connection = require('./connector/db');

const main = async () => {
  try {
    const candidates = await getCandidates();
    const employees = await getEmployees();

    console.log(`Found ${candidates.length} candidates`);
    console.log(`Found ${employees.length} employees`);

    if (employees.length === 0) {
      console.log("No employees found in the database.");
      return;
    }
    if (candidates.length === 0) {
      console.log("No candidates found in the database.");
      return;
    }

    const { recruiterAssignments, developerAssignments } = assignCandidates(candidates, employees);
    await updateDatabase(recruiterAssignments, developerAssignments, connection);

    await generateReports(candidates, employees);

    console.log('Assignment and report generation completed.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    connection.end();
  }
};

main();
