(function(){
  "use strict";

  const banner = document.getElementById("verifyBanner");
  const inv = document.getElementById("invariants");
  const known = document.getElementById("knownDates");

  function li(text){
    const x = document.createElement("li");
    x.textContent = text;
    return x;
  }

  try {
    // Invariant 1: exactly 123 leap years in 334-year cycle
    let leapCount = 0;
    for (let y = 1; y <= 334; y++) if (SMLC.isLeapYear(y)) leapCount++;
    inv.appendChild(li(`Leap-month years in 334-year cycle: ${leapCount} (expected 123)`));

    // Invariant 2: total months = 4131
    let totalMonths = 0;
    for (let y = 1; y <= 334; y++) totalMonths += SMLC.generateMonths(y).length;
    inv.appendChild(li(`Total months in 334-year cycle: ${totalMonths} (expected 4131)`));

    // Known date: epoch
    const epoch = SMLC.gregorianToSMLC(2000,3,20);
    known.appendChild(li(`2000-03-20 → ${SMLC.MONTH_NAMES[epoch.monthIndex]} ${epoch.day}, Year ${epoch.year} (epoch)`));

    // Your earlier check example
    const d1 = SMLC.gregorianToSMLC(2025,12,31);
    known.appendChild(li(`2025-12-31 → ${SMLC.MONTH_NAMES[(d1.monthIndex>=7 && SMLC.isLeapYear(d1.year)) ? d1.monthIndex-1 : (d1.monthIndex===6 && SMLC.isLeapYear(d1.year) ? 5 : d1.monthIndex)]} ${d1.day}, Year ${d1.year}`));

    // Christmas label check: (holiday will appear in calendar; here we just show conversion)
    const d2 = SMLC.gregorianToSMLC(2002,12,25);
    if (d2.interday) {
      known.appendChild(li(`2002-12-25 → ${d2.name}, Year ${d2.year}`));
    } else {
      known.appendChild(li(`2002-12-25 → ${SMLC.MONTH_NAMES[(d2.monthIndex>=7 && SMLC.isLeapYear(d2.year)) ? d2.monthIndex-1 : (d2.monthIndex===6 && SMLC.isLeapYear(d2.year) ? 5 : d2.monthIndex)]} ${d2.day}, Year ${d2.year}`));
    }

    banner.innerHTML = "All checks executed. Review results below.";
  } catch(e){
    banner.innerHTML = `<strong>Error:</strong> ${e.message}`;
    console.error(e);
  }
})();

