// ===============================
// The Crawford Calendar — UI Logic (FINAL, SAFE)
// ===============================

function renderToday() {
  const todayDate = new Date();
  const c = crawfordFromDate(todayDate);

  // Primary Crawford display
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

  // Holiday display
  document.getElementById("holiday").innerText =
    c.holiday ? `Holiday: ${c.holiday}` : "";

  // Month grid — SAFE MODE
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  // Determine month length from month name (no globals)
  let daysInMonth = 29;
  const monthLengths = {
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

  if (monthLengths[c.month]) {
    daysInMonth = monthLengths[c.month];
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerText = i;

    if (i === c.day) {
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  }
}

// Run safely after page load
window.addEventListener("DOMContentLoaded", renderToday);


