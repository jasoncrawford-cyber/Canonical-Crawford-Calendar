// ===============================
// The Crawford Calendar — UI Logic
// ===============================

function renderToday() {
  const todayDate = new Date();
  const c = crawfordFromDate(todayDate);

  // Top display
  document.getElementById("weekday").textContent = c.weekday;
  document.getElementById("date").textContent = `${c.day} ${c.month}`;

  document.getElementById("status").textContent =
    c.isWorkday ? "Workday" : "Restday";

  document.getElementById("holiday").textContent =
    c.holiday ? c.holiday : "";

  // Month grid
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let daysInMonth = 29;
  for (const [name, length] of BASE_MONTHS) {
    if (name === c.month) {
      daysInMonth = length;
      break;
    }
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<strong>${i}</strong>`;

    if (i === c.day) {
      cell.classList.add("today");
    }

    // Holiday labels inside grid
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
renderToday();

// Offline support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

