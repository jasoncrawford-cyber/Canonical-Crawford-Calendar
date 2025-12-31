// =====================================================
// Crawford Millennial Lunisolar Calendar (CMLC)
// Canonical Core Logic — v1.0 (LOCKED)
// =====================================================
//
// Epoch (immutable):
// Solar Era (SE) Year 1 begins at the first new moon
// nearest the March equinox of Gregorian year 2000 CE.
//
// Astronomical instant:
// 24 March 2000, 05:28:00 UTC
//
// This instant defines:
// SE 1
// Cycle 1, Year 1
// Eastren 1
// Foreday
//
// No further astronomical observation is required.
// =====================================================


// -------------------------------
// Constants
// -------------------------------

// Locked astronomical epoch
const EPOCH = new Date(Date.UTC(2000, 2, 24, 5, 28, 0));
const MS_PER_DAY = 86400000;

// Grand cycle constants
const YEARS_PER_CYCLE = 334;
const MONTHS_PER_CYCLE = 4131;

// Month names (canonical order)
const MONTH_NAMES = [
  "Eastren",
  "Spryng",
  "Evenmarch",
  "Blossom",
  "Brightmonth",
  "Midsomer",
  "Harvest",
  "Evenfall",
  "Waning",
  "Frostfall",
  "Darkmonth",
  "Deepwinter"
];

// Weekday names (month-local)
const WEEKDAYS = [
  "Foreday",
  "Neistday",
  "Midday",
  "Gangday",
  "Fendday",
  "Restday",
  "Yondday"
];


// -------------------------------
// Month length (lunar-true)
// Month 1 = 30 days, alternating
// -------------------------------
function monthLength(index) {
  return (index % 2 === 0) ? 30 : 29;
}


// -------------------------------
// Exact leap-month rule
// (Non-negotiable; closed-form)
// -------------------------------
function isLeapMonthYear(seYear) {
  const a = Math.floor((MONTHS_PER_CYCLE * seYear) / YEARS_PER_CYCLE);
  const b = Math.floor((MONTHS_PER_CYCLE * (seYear - 1)) / YEARS_PER_CYCLE);
  return (a - b) === 13;
}


// -------------------------------
// Core conversion function
// Gregorian Date → Crawford Date
// -------------------------------
function crawfordFromDate(date) {

  // Days since epoch (UTC-based, deterministic)
  let days = Math.floor((date.getTime() - EPOCH.getTime()) / MS_PER_DAY);

  // ---------------------------
  // Resolve Solar Era year
  // ---------------------------
  let seYear = 1;

  while (true) {
    const monthsInYear = 12 + (isLeapMonthYear(seYear) ? 1 : 0);
    let yearLength = 0;

    for (let i = 0; i < monthsInYear; i++) {
      yearLength += monthLength(i);
    }

    if (days < yearLength) break;

    days -= yearLength;
    seYear++;
  }

  // ---------------------------
  // Build month list for year
  // ---------------------------
  let months = [];

  for (let i = 0; i < 12; i++) {
    months.push({
      name: MONTH_NAMES[i],
      length: monthLength(i)
    });

    // Insert leap month after Month 6
    if (i === 5 && isLeapMonthYear(seYear)) {
      months.push({
        name: MONTH_NAMES[i] + " (Leap)",
        length: monthLength(i)
      });
    }
  }

  // ---------------------------
  // Resolve month & day
  // ---------------------------
  let monthIndex = 0;

  while (days >= months[monthIndex].length) {
    days -= months[monthIndex].length;
    monthIndex++;
  }

  const dayOfMonth = days + 1;

  // ---------------------------
  // Weekday (month-local)
  // ---------------------------
  const weekday = WEEKDAYS[(dayOfMonth - 1) % 7];

  // ---------------------------
  // Cycle math (structural)
  // ---------------------------
  const cycle = Math.floor((seYear - 1) / YEARS_PER_CYCLE) + 1;
  const yearInCycle = ((seYear - 1) % YEARS_PER_CYCLE) + 1;

  // ---------------------------
  // Return canonical object
  // ---------------------------
  return {
    eraYear: seYear,           // Continuous historical year
    cycle: cycle,              // 334-year cycle number
    yearInCycle: yearInCycle,  // 1–334
    month: months[monthIndex].name,
    day: dayOfMonth,
    weekday: weekday
  };
}


// -------------------------------
// Optional helper (exportable)
// -------------------------------
function crawfordToday() {
  return crawfordFromDate(new Date());
}

