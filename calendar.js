// =====================================================
// Crawford Millennial Lunisolar Calendar (CMLC)
// Core Logic — Specification v1.0
// =====================================================

// Month names (you can localise later)
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

// Alternating lunar month lengths (Month 1 = 30)
function monthLength(index) {
  return index % 2 === 0 ? 30 : 29;
}

// Exact leap-month rule (334-year cycle)
function isLeapMonthYear(seYear) {
  const a = Math.floor((4131 * seYear) / 334);
  const b = Math.floor((4131 * (seYear - 1)) / 334);
  return (a - b) === 13;
}

const EPOCH = new Date(Date.UTC(2000, 2, 24, 5, 28, 0));
// (Numerically fixed once; no observation required)
const EPOCH = new Date(Date.UTC(2000, 2, 20)); 
// NOTE: placeholder UTC date — can be refined to exact astronomical timestamp
const MS_PER_DAY = 86400000;

function crawfordFromDate(date) {
  let days = Math.floor((date - EPOCH) / MS_PER_DAY);
  let seYear = 1;

  // Advance years
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

  // Build month list for the year
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

  // Resolve month and day
  let m = 0;
  while (days >= months[m].length) {
    days -= months[m].length;
    m++;
  }

  // Cycle math (structural, not historical)
  const cycle = Math.floor((seYear - 1) / 334) + 1;
  const yearInCycle = ((seYear - 1) % 334) + 1;

  return {
    eraYear: seYear,
    cycle,
    yearInCycle,
    month: months[m].name,
    day: days + 1
  };
}

