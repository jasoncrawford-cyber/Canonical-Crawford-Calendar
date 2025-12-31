// ===============================
// The Crawford Calendar — UI Logic (HARD FIX)
// ===============================

function renderToday() {
  const todayDate = new Date();

  // Force fresh calculation
  const c = crawfordFromDate(todayDate);

  // EXPLICIT weekday mapping (no ambiguity)
  const weekdayText = String(c.weekday);

  document.getElementById("weekday").innerText = weekdayText;
  document.getElementById("date").innerText = `${c.day} ${c.month}`;
  document.getElementById("status").innerText =
    c.isWorkday ? "Workday" : "Restday";

  document.getElementById("holiday").innerText =
    c.holiday ? c.holiday : "";

  // DEBUG OUTPUT (temporary, visible proof)
  const debug = document.createElement("pre");
  debug.style.fontSize = "10px";
  debug.style.textAlign = "left";
  debug.textContent = JSON.stringify(c, null, 2);

  const app = document.getElementById("app");
  const oldDebug = document.getElementById("debug");
  if (oldDebug) oldDebug.remove();

  debug.id = "debug";
  app.appendChild(debug);

  // Month grid — safe version
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let months = [...BASE_MONTHS];
  if (isLeapMonthYear(c.eraYear)) {
    months.splice(6, 0, ["High Midsomer", 29]);
  }

  let daysInMonth = 29;
  for (const [name, len] of months) {
    if (name === c.month) {
      daysInMonth = len;
      break;
    }
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<strong>${i}</strong>`;
    if (i === c.day) cell.classList.add("today");
    grid.appendChild(cell);
  }
}

// GUARANTEED execution
window.onload = renderToday;

