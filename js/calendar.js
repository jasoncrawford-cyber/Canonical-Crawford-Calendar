const EPOCH_JDN = gregorianToJDN(2000, 3, 20); 
// Epoch: Spring Equinox anchor (see about-epoch.html)

function loadToday() {
  const now = new Date();
  const jdn = gregorianToJDN(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  const absDay = jdn - EPOCH_JDN;
  const today = absoluteToMLC(absDay);

  document.getElementById("yearInput").value = today.year;
  render(today, absDay);
}

function render(highlight = null, highlightAbs = null) {
  const year = parseInt(document.getElementById("yearInput").value, 10);
  const months = generateMonths(year);
  const out = document.getElementById("output");

  out.innerHTML = "";

  let absCursor = daysBeforeYear(year);

  months.forEach((m, idx) => {
    const baseIndex = idx > 6 && m.leap ? idx - 1 : idx;

    const title = document.createElement("h3");
    title.textContent = m.leap
      ? `${MONTH_NAMES[baseIndex]} (Leap)`
      : MONTH_NAMES[baseIndex];
    out.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "calendar";

    for (let d = 1; d <= m.length; d++) {
      const cell = document.createElement("div");
      cell.className = "day";

      const weekday = WEEKDAYS[absCursor % 7];
      if (weekday === "Restday" || weekday === "Yondday") {
        cell.classList.add("rest");
      }

      if (highlightAbs === absCursor) {
        cell.classList.add("today");
      }

      const holiday = getHoliday(year, idx, d);
      cell.innerHTML = `<strong>${d}</strong><br>${weekday}` +
        (holiday ? `<br><em>${holiday}</em>` : "");

      grid.appendChild(cell);
      absCursor++;
    }

    out.appendChild(grid);
  });
}

window.onload = loadToday;

