// ===============================
// The Crawford Calendar — App Logic
// Canonical version aligned to PDF
// ===============================

const WEEKDAYS = [
  "Foreday",
  "Neistday",
  "Midday",
  "Gangday",
  "Fendday",
  "Restday",
  "Yondday"
];

const MONTH_LENGTHS = {
  "Eastren": 30,
  "Spryng": 29,
  "Evenmarch": 30,
  "Blossom": 29,
  "Brightmonth": 30,
  "Midsomer": 29,
  "High Midsomer": 29,
  "Stillheat": 30,
  "Harvest": 29,
  "Evenfall": 30,
  "Waning": 29,
  "Frostfall": 30,
  "Darkmonth": 29
};

function renderToday() {
  const today = new Date();
  const c = crawfordFromDate(today);

  // ─────────────────────────────
  // Month name (PDF style)
  // ─────────────────────────────
  document.getElementById("month-name").innerText = c.month;

  // ─────────────────────────────
  // Weekday (month-local, Firstday = 1)
  // ─────────────────────────────
  const localWeekday = WEEKDAYS[(c.day - 1) % 7];
  document.getElementById("weekday").innerText = localWeekday;

  // ─────────────────────────────
  // Crawford date
  // ─────────────────────────────
  document.getElementById("date").innerText =
    `${c.day} ${c.month}`;

  // ─────────────────────────────
  // Gregorian date (secondary)
  // ─────────────────────────────
  const gregorianText = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("gregorian").innerText =
    `Gregorian: ${gregorianText}`;

  // ─────────────────────────────
  // Work / Rest
  // ─────────────────────────────
  document.getElementById("status").innerText =
    ["Foreday","Neistday","Midday","Gangday","Fendday"].includes(localWeekday)
      ? "Workday"
      : "Restday";

  // ─────────────────────────────
  // Holiday display
  // ─────────────────────────────
  document.getElementById("holiday").innerText =
    c.holiday ? `Holiday: ${c.holiday}` : "";

  // ─────────────────────────────
  // Month grid (PDF-aligned)
  // ─────────────────────────────
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const daysInMonth = MONTH_LENGTHS[c.month] || 29;

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerText = day;

    if (day === c.day) {
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  }
}

// Run safely
window.addEventListener("DOMContentLoaded", renderToday);

