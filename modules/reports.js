const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const generateReports = (candidates, employees) => {
  const recruiters = employees.filter((e) => e.role === "Recruiter");
  const developers = employees.filter(
    (e) => e.role === "разработчик" || e.role === "Developer"
  );

  const recruiterReport = recruiters.map((e) => {
    const initial_count = candidates.filter(
      (c) => c.employee_id === e.id
    ).length;
    const test_passed_count = candidates.filter(
      (c) => c.role === "Recruiter" && c.employee_id === e.id
    ).length;
    return {
      fio: e.fio || "Unknown",
      initial_count,
      test_passed_count,
      final_count: e.attached_candidates_count || 0,
    };
  });

  const developerReport = developers.map((e) => {
    const initial_count = candidates.filter(
      (c) =>
        c.employee_id === e.id &&
        (c.role === "разработчик" || c.role === "Developer")
    ).length;
    return {
      fio: e.fio || "Unknown",
      initial_count,
      final_count: e.attached_candidates_count || 0,
      remaining_tests: Math.max(0, 3000 - (e.attached_candidates_count || 0)),
    };
  });

  if (developerReport.length > 0) {
    const developerWithMostCandidates = developerReport.reduce(
      (max, dev) => (dev.final_count > max.final_count ? dev : max),
      developerReport[0]
    );
    console.log(
      `Разработчик с наибольшим количеством кандидатов: ${developerWithMostCandidates.fio}, количество кандидатов: ${developerWithMostCandidates.final_count}`
    );
  } else {
    console.log("Нет данных о разработчиках.");
  }

  const recruiterCsvWriter = createCsvWriter({
    path: "recruiter_report.csv",
    header: [
      { id: "fio", title: "ФИО Рекрутера" },
      { id: "initial_count", title: "Кол-во Кандидатов до распределения" },
      {
        id: "test_passed_count",
        title: "Кол-во Кандидатов до тестового задания",
      },
      { id: "final_count", title: "Кол-во Кандидатов после распределения" },
    ],
  });

  const developerCsvWriter = createCsvWriter({
    path: "developer_report.csv",
    header: [
      { id: "fio", title: "ФИО Разработчика" },
      {
        id: "initial_count",
        title: "Кол-во переданных Кандидатов до распределения",
      },
      { id: "final_count", title: "Кол-во Кандидатов после распределения" },
      { id: "remaining_tests", title: "Оставшееся кол-во тестов" },
    ],
  });

  return Promise.all([
    recruiterCsvWriter.writeRecords(recruiterReport),
    developerCsvWriter.writeRecords(developerReport),
  ]);
};

module.exports = { generateReports };
