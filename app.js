// ===============================
// The Crawford Calendar — UI Logic (FIXED)
// ===============================

function renderToday() {
  const todayDate = new Date();
  const c = crawfordFromDate(todayDate);

  // Defensive checks (prevents "0" bug)
  document.getElementById("weekday").textContent =
    typeof c.weekday === "string" ? c.weekday : "—";

  document.getElementById("date").textContent =
    `${c.day} ${c.month}`;

  document.getElementById("status").textContent =
    c.isWorkday ? "Workday" : "Restday";

  document.getElementById("holiday").textContent =
    c.holiday ? c.holiday : "";

  // Determine month length properly (including leap months)
  let months = [...BASE_MONTHS];
  if (isLeapMonthYear(c.eraYear)) {
    months.splice(6, 0, ["High Midsomer", 29]);
  }

  let daysInMonth = 29;
  for (const [name, length] of months) {
    if (name === c.month) {
      daysInMonth = length;
      break;
    }
  }

  // Month grid
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<strong>${i}</strong>`;

    if (i === c.day) {
      cell.classList.add("today");
    }

    // Holiday labels
    if (
      (c.month === "Eastren" && i === 1) ||
      (c.month === "Evenmarch" && i === 15) ||
      (c.month === "Midsomer" && i === 15) ||
      (c.month === "Evenfall" && i === 15) ||
      (c.month === "Darkmonth" && i === 15)
    ) {
      cell.innerHTML += "<br><small>Holiday</small>";
    }

    grid.appendChild(cell);
  }
}

// Run on load
document.addEventListener("DOMContentLoaded", renderToday);

// Offline support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

