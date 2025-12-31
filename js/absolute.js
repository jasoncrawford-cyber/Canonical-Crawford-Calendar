function daysBeforeYear(year) {
  let days = 0;

  for (let y = 1; y < year; y++) {
    generateMonths(y).forEach(m => (days += m.length));
    days += isLeapMonthYear(y) ? 2 : 1;
  }

  return days;
}

function absoluteToMLC(absDay) {
  let year = 1;
  while (daysBeforeYear(year + 1) <= absDay) year++;

  let remaining = absDay - daysBeforeYear(year);
  const months = generateMonths(year);

  for (let i = 0; i < months.length; i++) {
    if (remaining < months[i].length) {
      return {
        year,
        monthIndex: i,
        day: remaining + 1,
      };
    }
    remaining -= months[i].length;
  }

  return { year, interday: true };
}
