(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const pad2 = (n) => String(n).padStart(2, "0");

  const LS_MOON = "smlc_show_moon";
  const LS_SOLAR = "smlc_show_solar";

  function clampYear(y){
    if (!Number.isFinite(y)) return 1;
    return Math.min(334, Math.max(1, y));
  }

  function mapMonthNameIndex(year, monthIndex){
    const months = SMLC.generateMonths(year);
    const leapExists = months.length === 13;
    if (!leapExists) return monthIndex;
    if (monthIndex === 6) return 5;       // leap month repeats month 6 name
    if (monthIndex >= 7) return monthIndex - 1;
    return monthIndex;
  }

  function setBanner(todayObj){
    const banner = $("todayBanner");
    if (!banner) return;

    const now = todayObj.now;
    const t = todayObj.smlc;
    const g = `${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}`;

    if (t.interday) {
      banner.innerHTML = `<strong>Today (SMLC):</strong> ${t.name}, Year ${t.year}<br><em>Gregorian:</em> ${g}`;
      return;
    }

    const monthName = SMLC.MONTH_NAMES[mapMonthNameIndex(t.year, t.monthIndex)];
    banner.innerHTML = `<strong>Today (SMLC):</strong> ${monthName} ${t.day}, Year ${t.year}<br><em>Gregorian:</em> ${g}`;
  }

  function updateInterdaysPanel(year){
    const panel = $("interdaysPanel");
    if (!panel) return;

    const leap = SMLC.isLeapYear(year);
    const items = leap ? ["Yearsend", "High Yearsend"] : ["Yearsend"];

    panel.innerHTML = `
      <strong>Interdays (outside the weekly grid)</strong><br>
      <span class="small-muted">These occur after Darkmonth and do not belong to Foreday–Yondday.</span>
      <ul class="tight-list">
        ${items.map(n => `<li>${n}</li>`).join("")}
      </ul>
      <div class="small-muted">
        This year is <strong>${leap ? "a leap-month year (13 months)" : "a common year (12 months)"}</strong>.
      </div>
    `;
  }

  function setLegendVisible(show){
    const box = $("moonLegend");
    if (!box) return;

    if (!show) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }

    box.style.display = "block";
    box.innerHTML = `
      <strong>Moon phase legend</strong>
      <div class="legend-row">
        <span title="New Moon">🌑</span>
        <span title="Waxing Crescent">🌒</span>
        <span title="First Quarter">🌓</span>
        <span title="Waxing Gibbous">🌔</span>
        <span title="Full Moon">🌕</span>
        <span title="Waning Gibbous">🌖</span>
        <span title="Last Quarter">🌗</span>
        <span title="Waning Crescent">🌘</span>
      </div>
      <div class="small-muted">Hover the icon on any date for details.</div>
    `;
  }

  function renderYear(year, highlight, opts){
    const out = $("output");
    if (!out) return;
    out.innerHTML = "";

    const months = SMLC.generateMonths(year);
    const absYearStart = SMLC.daysBeforeYear(year);

    let cumDays = 0;

    months.forEach((m, idx) => {
      const nameIndex = mapMonthNameIndex(year, idx);
      const monthName = SMLC.MONTH_NAMES[nameIndex];

      const h = document.createElement("h3");
      h.textContent = (m.leap ? `${monthName} (Leap)` : monthName) + ` — ${m.length} days`;
      out.appendChild(h);

      // Month-end solar progress
      if (opts.showSolar) {
        const absMonthEnd = absYearStart + cumDays + m.length;
        const solar = SMLC.solarYearPosition(absMonthEnd);
        const pct = solar.fraction * 100;

        const meta = document.createElement("div");
        meta.className = "month-meta small-muted";
        meta.innerHTML = `
          Solar year completion at month end:
          <strong>${pct.toFixed(2)}%</strong>
          <span class="small-muted">(${SMLC.formatDayTime(solar.daysSinceEpochYearStart)} since epoch equinox)</span>
          <div class="progress" aria-label="Solar year progress">
            <div class="bar" style="width:${pct.toFixed(2)}%"></div>
          </div>
        `;
        out.appendChild(meta);
      }

      // weekday headers
      const header = document.createElement("div");
      header.className = "calendar-grid";
      for (const w of SMLC.WEEKDAYS) {
        const c = document.createElement("div");
        c.className = "cell header";
        c.textContent = w;
        header.appendChild(c);
      }
      out.appendChild(header);

      // day cells
      const grid = document.createElement("div");
      grid.className = "calendar-grid";

      for (let d = 1; d <= m.length; d++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const weekday = SMLC.WEEKDAYS[(d - 1) % 7];
        if (weekday === "Restday") cell.classList.add("restday");
        if (weekday === "Yondday") cell.classList.add("yondday");

        if (highlight && !highlight.interday &&
            highlight.year === year && highlight.monthIndex === idx && highlight.day === d) {
          cell.classList.add("today");
        }

        const holiday = SMLC.getHoliday ? SMLC.getHoliday(year, idx, d) : null;

        let phaseHTML = "";
        if (opts.showMoon) {
          const abs = absYearStart + cumDays + (d - 1);
          const jdn = SMLC.EPOCH_JDN + abs;
          const phase = SMLC.moonPhaseForJDN(jdn + 0.5); // noon-ish for stability
          phaseHTML = `<span class="phase" title="${phase.name} • age ${phase.ageDays.toFixed(1)}d • illum ${(phase.illumination*100).toFixed(0)}%">${phase.emoji}</span>`;
        }

        cell.innerHTML = `
          <div class="dayline">
            <strong>${d}</strong>
            ${phaseHTML}
          </div>
          ${holiday ? `<span class="holiday">${holiday}</span>` : ""}
        `;

        grid.appendChild(cell);
      }

      out.appendChild(grid);
      cumDays += m.length;
    });
  }

  function readBoolLS(key, fallback){
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "true";
  }

  function writeBoolLS(key, val){
    localStorage.setItem(key, val ? "true" : "false");
  }

  function main(){
    const yearInput = $("yearInput");
    const showBtn = $("showYearBtn");
    const prevBtn = $("prevYearBtn");
    const nextBtn = $("nextYearBtn");
    const todayBtn = $("todayYearBtn");

    const toggleMoon = $("toggleMoon");
    const toggleSolar = $("toggleSolar");

    try {
      const todayObj = SMLC.today();
      const today = todayObj.smlc;

      setBanner(todayObj);

      const opts = {
        showMoon: readBoolLS(LS_MOON, true),
        showSolar: readBoolLS(LS_SOLAR, true),
      };

      if (toggleMoon) toggleMoon.checked = opts.showMoon;
      if (toggleSolar) toggleSolar.checked = opts.showSolar;

      setLegendVisible(opts.showMoon);

      yearInput.value = today.year;
      updateInterdaysPanel(today.year);
      renderYear(today.year, today, opts);

      function rerender(){
        const y = clampYear(Number(yearInput.value));
        yearInput.value = y;
        updateInterdaysPanel(y);
        renderYear(y, (y === today.year) ? today : null, opts);
      }

      showBtn.addEventListener("click", rerender);
      prevBtn.addEventListener("click", () => { yearInput.value = clampYear(Number(yearInput.value) - 1); rerender(); });
      nextBtn.addEventListener("click", () => { yearInput.value = clampYear(Number(yearInput.value) + 1); rerender(); });
      todayBtn.addEventListener("click", () => { yearInput.value = today.year; rerender(); });

      yearInput.addEventListener("keydown", (e) => { if (e.key === "Enter") rerender(); });

      if (toggleMoon) {
        toggleMoon.addEventListener("change", () => {
          opts.showMoon = !!toggleMoon.checked;
          writeBoolLS(LS_MOON, opts.showMoon);
          setLegendVisible(opts.showMoon);
          rerender();
        });
      }

      if (toggleSolar) {
        toggleSolar.addEventListener("change", () => {
          opts.showSolar = !!toggleSolar.checked;
          writeBoolLS(LS_SOLAR, opts.showSolar);
          rerender();
        });
      }

    } catch (e) {
      const banner = $("todayBanner");
      if (banner) banner.innerHTML = `<strong>Error:</strong> ${e.message}`;
      console.error(e);
    }
  }

  window.addEventListener("DOMContentLoaded", main);
})();
