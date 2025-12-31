// ===============================
// The Crawford Calendar — Core Logic
// ===============================

// Weekdays (continuous, never reset)
const WEEKDAYS = [
  "Foreday",
  "Neistday",
  "Midday",
  "Gangday",
  "Fendday",
  "Restday",
  "Yondday"
];

// Base months (leap month inserted conditionally)
const BASE_MONTHS = [
  ["Eastren", 30],
  ["Spryng", 29],
  ["Evenmarch", 30],
  ["Blossom", 29],
  ["Brightmonth", 30],
  ["Midsomer", 29],
  ["Stillheat", 30],
  ["Harvest", 29],
  ["Evenfall", 30],
  ["Waning", 29],
  ["Frostfall", 30],
  ["Darkmonth", 29]
];

// Leap-month rule (334-year cycle)
function isLeapMonthYear(year) {
  const a = Math.floor((4131 * year) / 334);
  const b = Math.floor((4131 * (year - 1)) / 334);
  return a - b === 13;
}

// Fixed epoch: 20 March 2000
function crawfordEpoch() {
  return new Date(2000, 2, 20, 0, 0, 0);
}

// Whole days between dates
function daysBetween(a, b) {
  return Math.floor((b - a) / 86400000);
}

// Convert a Date → Crawford date object
function crawfordFromDate(date) {
  const epoch = crawfordEpoch();
  const daysSinceEpoch = daysBetween(epoch, date);

  // Weekday
  const weekdayIndex = ((daysSinceEpoch % 7) + 7) % 7;
  const weekday = WEEKDAYS[weekdayIndex];
  const isWorkday = weekdayIndex <= 4;

  // Solar Era year (aligned with Gregorian)
  const eraYear = date.getFullYear();
  const cycle = Math.floor((eraYear - 1) / 334) + 1;
  const yearInCycle = ((eraYear - 1) % 334) + 1;

  // Build month list
  let months = [...BASE_MONTHS];
  if (isLeapMonthYear(eraYear)) {
    // Insert High Midsomer after Midsomer
    months.splice(6, 0, ["High Midsomer", 29]);
  }

  // Day of year
  const startOfYear = new Date(eraYear, 0, 1);
  let dayOfYear = daysBetween(startOfYear, date) + 1;

  let month = "";
  let day = 0;

  for (const [name, length] of months) {
    if (dayOfYear <= length) {
      month = name;
      day = dayOfYear;
      break;
    }
    dayOfYear -= length;
  }

  // Holidays
  let holiday = null;
  if (month === "Eastren" && day === 1) holiday = "Forelicht";
  if (month === "Evenmarch" && day === 15) holiday = "Spring Equinox";
  if (month === "Midsomer" && day === 15) holiday = "Midsomer";
  if (month === "Evenfall" && day === 15) holiday = "Autumn Equinox";
  if (month === "Darkmonth" && day === 15) holiday = "Christmas";

  return {
    eraYear,
    cycle,
    yearInCycle,
    month,
    day,
    weekday,
    isWorkday,
    holiday
  };
}

