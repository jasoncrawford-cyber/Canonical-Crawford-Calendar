/*
  Holiday system for the Crawford / Millennial Lunisolar Calendar (MLC)

  Supports:
  - Fixed MLC holidays
  - Seasonal anchors (equinoxes & solstices)
  - Gregorian-based movable feasts (Easter)
  - Gregorian fixed holidays mapped into MLC (U.S. Independence Day)

  Dependencies (must already be loaded):
  - gregorianToJDN()
  - absoluteToMLC()
  - EPOCH_JDN
  - gregorianEaster()
*/

/* ============================================================
   MAIN HOLIDAY LOOKUP
   ============================================================ */

function getHoliday(year, monthIndex, day) {

  /* -----------------------------
     FIXED MLC HOLIDAYS
     ----------------------------- */
  const fixedMLC = [
    { m: 0, d: 1,  name: "Year Day" },
    { m: 5, d: 16, name: "Midsummer" },
    { m: 11, d: 15, name: "Christmas" }
  ];

  for (const h of fixedMLC) {
    if (h.m === monthIndex && h.d === day) {
      return h.name;
    }
  }

  /* -----------------------------
     SEASONAL ANCHORS (FIXED)
     ----------------------------- */
  const seasonal = [
    { m: 2,  d: 16, name: "Spring Equinox" },
    { m: 5,  d: 16, name: "Summer Solstice" },
    { m: 8,  d: 16, name: "Autumn Equinox" },
    { m: 11, d: 16, name: "Winter Solstice" }
  ];

  for (const s of seasonal) {
    if (s.m === monthIndex && s.d === day) {
      return s.name;
    }
  }

  /* ============================================================
     GREGORIAN → MLC MAPPED HOLIDAYS
     ============================================================ */

  /*
    Gregorian year corresponding to this MLC year.

    Epoch:
    MLC Year 1 ≈ Gregorian 2000
  */
  const gregYear = 1999 + year;

  /* -----------------------------
     ✝️ EASTER (MOVABLE)
     ----------------------------- */
  const easter = gregorianEaster(gregYear);
  const easterJDN = gregorianToJDN(
    gregYear,
    easter.month,
    easter.day
  );
  const easterAbs = easterJDN - EPOCH_JDN;
  const easterMLC = absoluteToMLC(easterAbs);

  if (
    easterMLC.year === year &&
    easterMLC.monthIndex === monthIndex &&
    easterMLC.day === day
  ) {
    return "Easter";
  }

  /* -----------------------------
     🇺🇸 U.S. INDEPENDENCE DAY
     ----------------------------- */
  const july4JDN = gregorianToJDN(gregYear, 7, 4);
  const july4Abs = july4JDN - EPOCH_JDN;
  const july4MLC = absoluteToMLC(july4Abs);

  if (
    july4MLC.year === year &&
    july4MLC.monthIndex === monthIndex &&
    july4MLC.day === day
  ) {
    return "U.S. Independence Day";
  }

  /* -----------------------------
     NO HOLIDAY
     ----------------------------- */
  return null;
}
