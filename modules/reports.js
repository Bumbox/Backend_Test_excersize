const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const generateReports = (candidates, employees) => {
  console.log("Employees count:", employees.length);
  console.log("Candidates count:", candidates.length);

  if (employees.length === 0) {
    console.log("No employees found.");
  }
  if (candidates.length === 0) {
    console.log("No candidates found.");
  }

  const recruiters = employees.filter(e => e.role === 'рекрутер');
  const developers = employees.filter(e => e.role === 'разработчик');

  console.log("Recruiters count:", recruiters.length);     //Отладка
  console.log("Developers count:", developers.length);

  const recruiterReport = recruiters.map(e => {
    const initial_count = candidates.filter(c => c.employee_id === e.id).length;
    const test_passed_count = candidates.filter(c => c.role === 'рекрутер' && c.employee_id === e.id).length;
    return {
      fio: e.fio || 'Unknown',
      initial_count,
      test_passed_count,
      final_count: e.attached_candidates_count || 0,
    };
  });

  console.log("Recruiter Report:", recruiterReport);        //Отладка

  const developerReport = developers.map(e => {
    const initial_count = candidates.filter(c => c.employee_id === e.id && (c.role === 'разработчик')).length;
    return {
      fio: e.fio || 'Unknown',
      initial_count,
      final_count: e.attached_candidates_count || 0,
      remaining_tests: Math.max(0, 3000 - (e.attached_candidates_count || 0)),
    };
  });

  console.log("Developer Report:", developerReport);     //Отладка

  if (developerReport.length > 0) {
    const developerWithMostCandidates = developerReport.reduce((max, dev) => dev.final_count > max.final_count ? dev : max, developerReport[0]);
    console.log(`Разработчик с наибольшим количеством кандидатов: ${developerWithMostCandidates.fio}, количество кандидатов: ${developerWithMostCandidates.final_count}`);
  } else {
    console.log("Нет данных о разработчиках.");
  }

  const recruiterCsvWriter = createCsvWriter({
    path: 'recruiter_report.csv',
    header: [
      {id: 'fio', title: 'ФИО Рекрутера'},
      {id: 'initial_count', title: 'Кол-во Кандидатов до распределения'},
      {id: 'test_passed_count', title: 'Кол-во Кандидатов до тестового задания'},
      {id: 'final_count', title: 'Кол-во Кандидатов после распределения'},
    ]
  });

  const developerCsvWriter = createCsvWriter({
    path: 'developer_report.csv',
    header: [
      {id: 'fio', title: 'ФИО Разработчика'},
      {id: 'initial_count', title: 'Кол-во переданных Кандидатов до распределения'},
      {id: 'final_count', title: 'Кол-во Кандидатов после распределения'},
      {id: 'remaining_tests', title: 'Оставшееся кол-во тестов'},
    ]
  });

  return Promise.all([
    recruiterCsvWriter.writeRecords(recruiterReport),
    developerCsvWriter.writeRecords(developerReport),
  ]);
};

module.exports = { generateReports };
