(function () {
  "use strict";

  const SMLC = {};

  /* =========================
     CONSTANTS
     ========================= */
  SMLC.CYCLE_YEARS = 334;
  SMLC.TOTAL_MONTHS = 4131;

  SMLC.MONTH_NAMES = [
    "Eastren", "Spryng", "Evenmarch", "Blossom",
    "Brightmonth", "Midsomer", "Stillheat", "Harvest",
    "Evenfall", "Waning", "Frostfall", "Darkmonth"
  ];

  SMLC.WEEKDAYS = [
    "Foreday", "Neistday", "Midday",
    "Gangday", "Fendday", "Restday", "Yondday"
  ];

  /* =========================
     GREGORIAN ↔ JDN
     ========================= */
  SMLC.gregorianToJDN = function (y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return d +
      Math.floor((153 * m2 + 2) / 5) +
      365 * y2 +
      Math.floor(y2 / 4) -
      Math.floor(y2 / 100) +
      Math.floor(y2 / 400) -
      32045;
  };

  SMLC.jdnToGregorian = function (jdn) {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);

    return {
      year: b * 100 + d - 4800 + Math.floor(m / 10),
      month: m + 3 - 12 * Math.floor(m / 10),
      day: e - Math.floor((153 * m + 2) / 5) + 1
    };
  };

  /* =========================
     EPOCH
     ========================= */
  SMLC.EPOCH_JDN = SMLC.gregorianToJDN(2000, 3, 20);

  /* =========================
     LEAP MONTH LOGIC
     ========================= */
  SMLC.isLeapYear = function (y) {
    const a = Math.floor(SMLC.TOTAL_MONTHS * y / SMLC.CYCLE_YEARS);
    const b = Math.floor(SMLC.TOTAL_MONTHS * (y - 1) / SMLC.CYCLE_YEARS);
    return (a - b) === 13;
  };

  SMLC.generateMonths = function (year) {
    const months = [];
    let lunar = 0;
    const leap = SMLC.isLeapYear(year);

    for (let i = 0; i < 12; i++) {
      lunar++;
      months.push({ length: lunar % 2 ? 30 : 29, leap: false });

      if (leap && i === 5) {
        months.push({ length: lunar % 2 ? 30 : 29, leap: true });
      }
    }
    return months;
  };

  /* =========================
     ABSOLUTE DAY CONVERSION
     ========================= */
  SMLC.daysBeforeYear = function (year) {
    let days = 0;
    for (let y = 1; y < year; y++) {
      SMLC.generateMonths(y).forEach(m => days += m.length);
      days += SMLC.isLeapYear(y) ? 2 : 1;
    }
    return days;
  };

  SMLC.absoluteToMLC = function (abs) {
    let year = 1;
    while (SMLC.daysBeforeYear(year + 1) <= abs) year++;

    let rem = abs - SMLC.daysBeforeYear(year);
    const months = SMLC.generateMonths(year);

    for (let i = 0;
