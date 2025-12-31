// =====================================================
// Crawford Millennial Lunisolar Calendar (CMLC)
// Canonical Core Logic — v1.0 (LOCKED)
// =====================================================

// Locked astronomical epoch:
// First new moon nearest March equinox, 2000 CE
// 24 March 2000, 05:28 UTC
const EPOCH = new Date(Date.UTC(2000, 2, 24, 5, 28, 0));
const MS_PER_DAY = 86400000;

// Grand cycle constants
const YEARS_PER_CYCLE = 334;
const MONTHS_PER_CYCLE = 4131;

// Canonical month names (SEASONALLY ALIGNED)
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
  "Darkmonth",
  "Deepwinter",
  "Frostfall"
];

// Weekdays (month-local)
const WEEKDAYS = [
  "Foreday",
  "Neistday",
  "Midday",
  "Gangday",
  "Fendday",
  "Restday",
  "Yondday"
];

// Lunar month length (30/29 alternating, Month 1 = 30)
function monthLength(index) {
  return index % 2 === 0 ? 30 : 29;
}

// Exact leap-month rule (334-year cycle)
function isLeapMonthYear(seYear) {
  const a = Math.floor((MONTHS_PER_CYCLE * seYear) / YEARS_PER_CYCLE);
  const b = Math.floor((MONTHS_PER_CYCLE * (seYear - 1)) / YEARS_PER_CYCLE);
  return (a - b) === 13;
}

// Gregorian → Crawford
function crawfordFromDate(date) {
  let days = Math.floor((date.getTime() - EPOCH.getTime()) / MS_PER_DAY);
  let seYear = 1;

  // Resolve year
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

  // Build months for year
  let months = [];
  for (let i = 0; i < 12; i++) {
    months.push({
      name: MONTH_NAMES[i],
      length: monthLength(i)
    });

    // Leap month after Month 6
    if (i === 5 && isLeapMonthYear(seYear)) {
      months.push({
        name: MONTH_NAMES[i] + " (Leap)",
        length: monthLength(i)
      });
    }
  }

  // Resolve month/day
  let m = 0;
  while (days >= months[m].length) {
    days -= months[m].length;
    m++;
  }

  const day = days + 1;
  const weekday = WEEKDAYS[(day - 1) % 7];

  const cycle = Math.floor((seYear - 1) / YEARS_PER_CYCLE) + 1;
  const yearInCycle = ((seYear - 1) % YEARS_PER_CYCLE) + 1;

  return {
    eraYear: seYear,
    cycle,
    yearInCycle,
    month: months[m].name,
    day,
    weekday
  };
}

function crawfordToday() {
  return crawfordFromDate(new Date());
}


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

