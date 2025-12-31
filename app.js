// ===============================
// The Crawford Calendar — UI Logic
// ===============================

function renderToday() {
  const todayDate = new Date();
  const c = crawfordFromDate(todayDate);

  // Crawford display
  document.getElementById("weekday").innerText = c.weekday;
  document.getElementById("date").innerText = `${c.day} ${c.month}`;

  // Gregorian display
  const gregorianText = todayDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("gregorian").innerText =
    `Gregorian: ${gregorianText}`;

  // Work / Rest
  document.getElementById("status").innerText =
    c.isWorkday ? "Workday" : "Restday";

  // Holidays (Crawford + Gregorian)
  let holidayText = "";

  // Crawford holidays
  if (c.holiday) {
    holidayText = `Holiday: ${c.holiday}`;
  }

  // Gregorian fixed holidays
  if (todayDate.getMonth() === 11 && todayDate.getDate() === 25) {
    holidayText = "Holiday: Christmas Day";
  }
  if (todayDate.getMonth() === 0 && todayDate.getDate() === 1) {
    holidayText = "Holiday: New Year's Day";
  }
  if (todayDate.getMonth() === 6 && todayDate.getDate() === 4) {
    holidayText = "Holiday: Independence Day";
  }

  document.getElementById("holiday").innerText = holidayText;

  // Month grid
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

window.onload = renderToday;


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

