(function () {
  "use strict";

  function pad2(n){ return String(n).padStart(2,"0"); }

  function setBanner(todayObj){
    const banner = document.getElementById("todayBanner");
    const now = todayObj.now;
    const t = todayObj.smlc;

    if (t.interday) {
      banner.innerHTML = `
        <strong>Today (SMLC):</strong> ${t.name}, Year ${t.year}<br>
        <em>Gregorian:</em> ${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}
      `;
      return;
    }

    const monthName = SMLC.MONTH_NAMES[mapMonthNameIndex(t.year, t.monthIndex)];
    banner.innerHTML = `
      <strong>Today (SMLC):</strong> ${monthName} ${t.day}, Year ${t.year}<br>
      <em>Gregorian:</em> ${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}
    `;
  }

  // If a leap month exists after Month 6, its name is Month 6 again.
  function mapMonthNameIndex(year, monthIndex){
    const months = SMLC.generateMonths(year);
    // monthIndex is 0-based in generated months
    // Name mapping: indices 0..5 map normally; leap (index 6 if exists) maps back to 5; after that shift by -1.
    const leapExists = months.length === 13;
    if (!leapExists) return monthIndex;
    // In a leap year, months are: 0..5 (normal), 6 (leap copy of 5), 7..12 (map to 6..11)
    if (monthIndex === 6) return 5;
    if (monthIndex >= 7) return monthIndex - 1;
    return monthIndex;
  }

  function renderYear(year, highlight){
    const out = document.getElementById("output");
    out.innerHTML = "";

    const months = SMLC.generateMonths(year);

    months.forEach((m, idx) => {
      const h = document.createElement("h3");
      const nameIndex = mapMonthNameIndex(year, idx);
      const monthName = SMLC.MONTH_NAMES[nameIndex];
      h.textContent = (m.leap ? `${monthName} (Leap)` : monthName) + ` — ${m.length} days`;
      out.appendChild(h);

      // Weekday header row
      const header = document.createElement("div");
      header.className = "calendar-grid";
      for (const w of SMLC.WEEKDAYS) {
        const c = document.createElement("div");
        c.className = "cell header";
        c.textContent = w;
        header.appendChild(c);
      }
      out.appendChild(header);

      // Day cells: month always starts Foreday
      const grid = document.createElement("div");
      grid.className = "calendar-grid";

      for (let d = 1; d <= m.length; d++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const weekday = SMLC.WEEKDAYS[(d - 1) % 7];
        if (weekday === "Restday" || weekday === "Yondday") cell.classList.add("rest");

        if (highlight && !highlight.interday &&
            highlight.year === year && highlight.monthIndex === idx && highlight.day === d) {
          cell.classList.add("today");
        }

        const holiday = SMLC.getHoliday(year, idx, d);

        cell.innerHTML = `<strong>${d}</strong>`;
        if (holiday) {
          const span = document.createElement("span");
          span.className = "holiday";
          span.textContent = holiday;
          cell.appendChild(span);
        }

        grid.appendChild(cell);
      }

      out.appendChild(grid);
    });
  }

  function main(){
    const yearInput = document.getElementById("yearInput");
    const btn = document.getElementById("showYearBtn");

    try {
      const todayObj = SMLC.today();
      setBanner(todayObj);

      // Default year = today’s year
      yearInput.value = todayObj.smlc.year;
      renderYear(todayObj.smlc.year, todayObj.smlc);

      btn.addEventListener("click", () => {
        const y = Number(yearInput.value);
        renderYear(y, null);
      });

    } catch (e) {
      document.getElementById("todayBanner").innerHTML =
        `<strong>Error:</strong> ${e.message}`;
      console.error(e);
    }
  }

  window.addEventListener("DOMContentLoaded", main);
})();
