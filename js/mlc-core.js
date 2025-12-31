const CYCLE_YEARS = 334;
const TOTAL_MONTHS = 4131;

function isLeapMonthYear(y) {
  return (
    Math.floor((TOTAL_MONTHS * y) / CYCLE_YEARS) -
      Math.floor((TOTAL_MONTHS * (y - 1)) / CYCLE_YEARS) ===
    13
  );
}

function generateMonths(year) {
  const months = [];
  let lunar = 0;
  const leap = isLeapMonthYear(year);

  for (let i = 1; i <= 12; i++) {
    lunar++;
    months.push({
      length: lunar % 2 ? 30 : 29,
      leap: false,
    });

    if (leap && i === 6) {
      months.push({
        length: lunar % 2 ? 30 : 29,
        leap: true,
      });
    }
  }

  return months;
}
