// TEMPORARY SAFE VERSION — NO calendar.js required

const WEEKDAYS = [
  "Foreday",
  "Neistday",
  "Midday",
  "Gangday",
  "Fendday",
  "Restday",
  "Yondday"
];

const MONTH = "Waning";
const DAYS_IN_MONTH = 29;
const TODAY = 12;

function renderToday() {
  const localWeekday = WEEKDAYS[(TODAY - 1) % 7];

  document.getElementById("weekday").innerText = localWeekday;
  document.getElementById("date").innerText = `${TODAY} ${MONTH}`;
  document.getElementById("month-name").innerText = MONTH;

  document.getElementById("gregorian").innerText =
    "Gregorian: " + new Date().toDateString();

  document.getElementById("status").innerText =
    ["Foreday","Neistday","Midday","Gangday","Fendday"].includes(localWeekday)
      ? "Workday"
      : "Restday";

  document.getElementById("holiday").innerText = "";

  const grid = document.querySelector(".calendar-grid");
  grid.querySelectorAll(".day").forEach(d => d.remove());

  for (let d = 1; d <= DAYS_IN_MONTH; d++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerText = d;
    if (d === TODAY) cell.classList.add("today");
    grid.appendChild(cell);
  }
}

window.addEventListener("DOMContentLoaded", renderToday);
