(function(){
  "use strict";
  const status = document.getElementById("convertStatus");

  function nameFor(monthIndex, year){
    // same mapping as calendar
    const months = SMLC.generateMonths(year);
    const leap = months.length === 13;
    if (!leap) return SMLC.MONTH_NAMES[monthIndex];
    if (monthIndex === 6) return SMLC.MONTH_NAMES[5];
    if (monthIndex >= 7) return SMLC.MONTH_NAMES[monthIndex - 1];
    return SMLC.MONTH_NAMES[monthIndex];
  }

  function showStatus(msg){ status.innerHTML = msg; }

  document.getElementById("gToSBtn").addEventListener("click", () => {
    try {
      const y = Number(document.getElementById("gY").value);
      const m = Number(document.getElementById("gM").value);
      const d = Number(document.getElementById("gD").value);

      if (!y || !m || !d) throw new Error("Enter a valid Gregorian date.");

      const s = SMLC.gregorianToSMLC(y, m, d);
      const out = document.getElementById("gToSOut");

      if (s.interday) {
        out.innerHTML = `<strong>SMLC:</strong> ${s.name}, Year ${s.year}`;
      } else {
        out.innerHTML = `<strong>SMLC:</strong> ${nameFor(s.monthIndex, s.year)} ${s.day}, Year ${s.year}`;
      }

      showStatus("Converted successfully.");
    } catch(e){
      showStatus(`<strong>Error:</strong> ${e.message}`);
      console.error(e);
    }
  });

  document.getElementById("sToGBtn").addEventListener("click", () => {
    try {
      const y = Number(document.getElementById("sY").value);
      const mo = Number(document.getElementById("sMo").value);
      const d = Number(document.getElementById("sD").value);

      if (!y || !mo || !d) throw new Error("Enter a valid SMLC date.");

      const g = SMLC.smlcToGregorian(y, mo, d);
      const out = document.getElementById("sToGOut");

      out.innerHTML = `<strong>Gregorian:</strong> ${g.year}-${String(g.month).padStart(2,"0")}-${String(g.day).padStart(2,"0")}`;
      showStatus("Converted successfully.");
    } catch(e){
      showStatus(`<strong>Error:</strong> ${e.message}`);
      console.error(e);
    }
  });
})();

