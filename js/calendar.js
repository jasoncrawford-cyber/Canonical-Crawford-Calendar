function loadToday() {
  const now = new Date();

  const gregorianText =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const jdn = gregorianToJDN(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  const absDay = jdn - EPOCH_JDN;
  const today = absoluteToMLC(absDay);

  document.getElementById("yearInput").value = today.year;

  document.getElementById("todayBanner").innerHTML = `
    <strong>Today (MLC):</strong>
    ${MONTH_NAMES[today.monthIndex]} ${today.day}, Year ${today.year}<br>
    <em>Gregorian:</em> ${gregorianText}
  `;

  render(today);
}

function render(highlight = null) {
  const year = parseInt(document.getElementById("yearInput").value, 10);
  const months = generateMonths(year);
  const out = document.getElementById("output");

  out.innerHTML = "";

  months.forEach((m, idx) => {
    const baseIndex = idx > 6 && m.leap ? idx - 1 : idx;

    const title = document.createElement("h3");
    title.textContent = m.leap
      ? `${MONTH_NAMES[baseIndex]} (Leap)`
      : MONTH_NAMES[baseIndex];
    out.appendChild(title);

    // Weekday header row
    const header = document.createElement("div");
    header.className = "calendar";
    WEEKDAYS.forEach(w => {
      const h = document.createElement("div");
      h.className = "day weekday-header";
      h.textContent = w;
      header.appendChild(h);
    });
    out.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "calendar";

    for (let d = 1; d <= m.length; d++) {
      const cell = document.createElement("div");
      cell.className = "day";

      const weekday = WEEKDAYS[(d - 1) % 7];

      if (weekday === "Restday" || weekday === "Yondday") {
        cell.classList.add("rest");
      }

      if (
        highlight &&
        highlight.year === year &&
        highlight.monthIndex === idx &&
        highlight.day === d
      ) {
        cell.classList.add("today");
      }

      const holiday = getHoliday(year, idx, d);

      cell.innerHTML = `
        <strong>${d}</strong><br>
        ${holiday ? `<em>${holiday}</em>` : ""}
      `;

      grid.appendChild(cell);
    }

    out.appendChild(grid);
  });
}

window.onload = loadToday;

