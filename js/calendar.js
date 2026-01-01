(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const pad2 = (n) => String(n).padStart(2, "0");

  function mapMonthNameIndex(year, monthIndex) {
    const months = SMLC.generateMonths(year);
    const leapExists = months.length === 13;
    if (!leapExists) return monthIndex;
    if (monthIndex === 6) return 5;
    if (monthIndex >= 7) return monthIndex - 1;
    return monthIndex;
  }

  function setBanner(todayObj) {
    const banner = $("todayBanner");
    if (!banner) return;

    const now = todayObj.now;
    const t = todayObj.smlc;
    const g = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;

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

  function updateInterdaysPanel(year) {
    const panel = $("interdaysPanel");
    if (!panel) return; // ✅ prevents your null.innerHTML crash

    const leap = SMLC.isLeapYear(year);
    const items = leap ? ["Yearsend", "High Yearsend"] : ["Yearsend"];

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

  function renderYear(year, highlight) {
    const out = $("output");
    if (!out) return;

    out.innerHTML = "";

    const months = SMLC.generateMonths(year);

    months.forEach((m, idx) => {
      const h = document.createElement("h3");
      const nameIndex = mapMonthNameIndex(year, idx);
      const monthName = SMLC.MONTH_NAMES[nameIndex];
      h.textContent = (m.leap ? `${monthName} (Leap)` : monthName) + ` — ${m.length} days`;
      out.appendChild(h);

      const header = document.createElement("div");
      header.className = "calendar-grid";
      for (const w of SMLC.WEEKDAYS) {
        const c = document.createElement("div");
        c.className = "cell header";
        c.textContent = w;
        header.appendChild(c);
      }
      out.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "calendar-grid";

      for (let d = 1; d <= m.length; d++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const weekday = SMLC.WEEKDAYS[(d - 1) % 7]; // month always starts Foreday
        if (weekday === "Restday" || weekday === "Yondday") cell.classList.add("rest");

        if (
          highlight && !highlight.interday &&
          highlight.year === year &&
          highlight.monthIndex === idx &&
          highlight.day === d
        ) {
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

  function clampYear(y) {
    if (!Number.isFinite(y)) return 1;
    return Math.min(334, Math.max(1, y));
  }

  function main() {
    const banner = $("todayBanner");

    try {
      // Required elements
      const yearInput = $("yearInput");
      const showBtn = $("showYearBtn");
      if (!yearInput || !showBtn) {
        throw new Error("calendar.html is missing #yearInput or #showYearBtn (wrong file version).");
      }

      const prevBtn = $("prevYearBtn");
      const nextBtn = $("nextYearBtn");
      const todayBtn = $("todayYearBtn");

      const todayObj = SMLC.today();
      const today = todayObj.smlc;

      setBanner(todayObj);

      yearInput.value = today.year;
      updateInterdaysPanel(today.year);
      renderYear(today.year, today);

      function renderSelected() {
        const y = clampYear(Number(yearInput.value));
        yearInput.value = y;
        updateInterdaysPanel(y);
        renderYear(y, (y === today.year) ? today : null);
      }

      showBtn.addEventListener("click", renderSelected);

      if (prevBtn) prevBtn.addEventListener("click", () => { yearInput.value = clampYear(Number(yearInput.value) - 1); renderSelected(); });
      if (nextBtn) nextBtn.addEventListener("click", () => { yearInput.value = clampYear(Number(yearInput.value) + 1); renderSelected(); });
      if (todayBtn) todayBtn.addEventListener("click", () => { yearInput.value = today.year; renderSelected(); });

      yearInput.addEventListener("keydown", (e) => { if (e.key === "Enter") renderSelected(); });

    } catch (e) {
      if (banner) banner.innerHTML = `<strong>Error:</strong> ${e.message}`;
      console.error(e);
    }
  }

  window.addEventListener("DOMContentLoaded", main);
})();
