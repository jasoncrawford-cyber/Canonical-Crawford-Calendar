// ===============================
// Crawford Calendar — App Logic
// Single-grid, PDF-aligned version
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

  // Month + weekday (month-local, Day 1 = Foreday)
  const localWeekday = WEEKDAYS[(c.day - 1) % 7];

  document.getElementById("weekday").innerText = localWeekday;
  document.getElementById("date").innerText = `${c.day} ${c.month}`;
  document.getElementById("month-name").innerText = c.month;

  // Gregorian date
  document.getElementById("gregorian").innerText =
    "Gregorian: " + today.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  // Work / Rest
  document.getElementById("status").innerText =
    ["Foreday","Neistday","Midday","Gangday","Fendday"].includes(localWeekday)
      ? "Workday"
      : "Restday";

  // Holiday
  document.getElementById("holiday").innerText =
    c.holiday ? `Holiday: ${c.holiday}` : "";

  // Calendar grid
  const grid = document.querySelector(".calendar-grid");

  // Remove previous day cells (keep weekday headers)
  grid.querySelectorAll(".day").forEach(d => d.remove());

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

window.addEventListener("DOMContentLoaded", renderToday);
