// ===============================
// Crawford Calendar App Renderer
// ===============================

// Get DOM elements
const weekdayEl = document.getElementById("weekday");
const dateEl = document.getElementById("date");
const gregorianEl = document.getElementById("gregorian");
const statusEl = document.getElementById("status");
const holidayEl = document.getElementById("holiday");
const monthNameEl = document.getElementById("month-name");
const gridEl = document.getElementById("grid");

// Get today in Crawford calendar
const today = crawfordToday();

// ---------- Header ----------
weekdayEl.textContent = today.weekday;
dateEl.textContent = `${today.day} ${today.month}`;
gregorianEl.textContent = `Gregorian: ${new Date().toDateString()}`;
statusEl.textContent = "Workday";
holidayEl.textContent = "";

// ---------- Month name ----------
monthNameEl.textContent = today.month;

// ---------- Render month grid ----------
gridEl.innerHTML = "";

// Find month length
const monthIndex = (function () {
  const baseMonths = [
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

  let index = baseMonths.indexOf(today.month.replace(" (Leap)", ""));
  if (today.month.includes("(Leap)")) {
    return index + 1;
  }
  return index;
})();

const daysInMonth = (monthIndex % 2 === 0) ? 30 : 29;

// Build day cells
for (let d = 1; d <= daysInMonth; d++) {
  const cell = document.createElement("div");
  cell.className = "day";
  cell.textContent = d;

  if (d === today.day) {
    cell.classList.add("today");
  }

  gridEl.appendChild(cell);
}

