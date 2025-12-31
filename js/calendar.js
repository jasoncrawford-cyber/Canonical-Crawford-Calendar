window.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("todayBanner");
  const output = document.getElementById("output");
  const yearInput = document.getElementById("yearInput");

  try {
    const today = SMLC.today();
    const now = new Date();

    banner.innerHTML = `
      <strong>Today (SMLC):</strong>
      ${SMLC.MONTH_NAMES[today.monthIndex]} ${today.day}, Year ${today.year}<br>
      <em>Gregorian:</em>
      ${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}
    `;

    yearInput.value = today.year;
    render(today);

  } catch (e) {
    banner.innerHTML = `<strong>Error:</strong> ${e.message}`;
    console.error(e);
  }

  function render(highlight) {
    output.innerHTML = "";
    const year = Number(yearInput.value);
    const months = SMLC.generateMonths(year);

    months.forEach((m, idx) => {
      const h = document.createElement("h3");
      const nameIndex = idx > 6 && m.leap ? idx - 1 : idx;
      h.textContent = m.leap
        ? `${SMLC.MONTH_NAMES[nameIndex]} (Leap)`
        : SMLC.MONTH_NAMES[nameIndex];
      output.appendChild(h);

      const grid = document.createElement("div");
      grid.className = "calendar";

      SMLC.WEEKDAYS.forEach(w => {
        const d = document.createElement("div");
        d.className = "day weekday-header";
        d.textContent = w;
        grid.appendChild(d);
      });

      for (let d = 1; d <= m.length; d++) {
        const cell = document.createElement("div");
        cell.className = "day";
        const wd = SMLC.WEEKDAYS[(d - 1) % 7];

        if (wd === "Restday" || wd === "Yondday") cell.classList.add("rest");
        if (
          highlight &&
          highlight.year === year &&
          highlight.monthIndex === idx &&
          highlight.day === d
        ) cell.classList.add("today");

        cell.innerHTML = `<strong>${d}</strong>`;
        grid.appendChild(cell);
      }

      output.appendChild(grid);
    });
  }

  window.render = () => render();
});

