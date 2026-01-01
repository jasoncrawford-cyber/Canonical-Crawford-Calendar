(function () {
  "use strict";

  function pad2(n){ return String(n).padStart(2,"0"); }

  // Leap-month naming rule: leap month repeats Month 6 name
  function mapMonthNameIndex(year, monthIndex){
    const months = SMLC.generateMonths(year);
    const leapExists = months.length === 13;
    if (!leapExists) return monthIndex;

    // In leap years:
    // indices 0..5 normal
    // index 6 = leap copy of 5
    // indices 7..12 map to 6..11
    if (monthIndex === 6) return 5;
    if (monthIndex >= 7) return monthIndex - 1;
    return monthIndex;
  }

  function setBanner(todayObj){
    const banner = document.getElementById("todayBanner");
    const now = todayObj.now;
    const t = todayObj.smlc;

    const g = `${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}`;

    if (t.interday) {
      banner.innerHTML = `
        <strong>Today (SMLC):</strong> ${t.name}, Year ${t.year}<br>
        <em>Gregorian:</em> ${g}
      `;
      return;
    }

    const monthName = SMLC.MONTH_NAMES[mapMonthNameIndex(t.year, t.monthIndex)];
    banner.innerHTML = `
      <strong>Today (SMLC):</strong> ${monthName} ${t.day}, Year ${t.year}<br>
      <em>Gregorian:</em> ${g}
    `;
  }

  function updateInterdaysPanel(year){
    const panel = document.getElementById("interdaysPanel");
    const leap = SMLC.isLeapYear(year);

    const items = leap
      ? ["Yearsend", "High Yearsend"]
      : ["Yearsend"];

    panel.innerHTML = `
      <strong>Interdays (outside the weekly grid)</strong><br>
      <span class="small-muted">
        These occur after Darkmonth and do not belong to Foreday–Yondday.
      </span>
      <ul style="margin:0.5rem 0 0 1.1rem;">
        ${items.map(n => `<li>${n}</li>`).join("")}
      </ul>
      <div class="small-muted">
        This year is <strong>${leap ? "a leap-month year (13 months)" : "a common year (12 months)"}</strong>.
      </div>
    `;
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

      // Day cells — month always starts Foreday
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

        const holiday = SMLC.getHoliday ? SMLC.getHoliday(year, idx, d) : null;

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

  function clampYear(y){
    if (!Number.isFinite(y)) return 1;
    return Math.min(334, Math.max(1, y));
  }

  function main(){
    const yearInput = document.getElementById("yearInput");
    const showBtn = document.getElementById("showYearBtn");
    const prevBtn = document.getElementById("prevYearBtn");
    const nextBtn = document.getElementById("nextYearBtn");
    const todayBtn = document.getElementById("todayYearBtn");

    try {
      const todayObj = SMLC.today();
      const today = todayObj.smlc;

      setBanner(todayObj);

      // Snap year picker to today by default
      yearInput.value = today.year;

      updateInterdaysPanel(today.year);
      renderYear(today.year, today);

      function renderSelectedYear(){
        const y = clampYear(Number(yearInput.value));
        yearInput.value = y;

        updateInterdaysPanel(y);

        // Only highlight “today” if viewing today’s year
        const highlight = (y === today.year) ? today : null;
        renderYear(y, highlight);
      }

      showBtn.addEventListener("click", renderSelectedYear);

      prevBtn.addEventListener("click", () => {
        yearInput.value = clampYear(Number(yearInput.value) - 1);
        renderSelectedYear();
      });

      nextBtn.addEventListener("click", () => {
        yearInput.value = clampYear(Number(yearInput.value) + 1);
        renderSelectedYear();
      });

      todayBtn.addEventListener("click", () => {
        yearInput.value = today.year;
        renderSelectedYear();
      });

      // Optional: change year and press Enter
      yearInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") renderSelectedYear();
      });

    } catch (e) {
      document.getElementById("todayBanner").innerHTML =
        `<strong>Error:</strong> ${e.message}`;
      console.error(e);
    }
  }

  window.addEventListener("DOMContentLoaded", main);
})();
