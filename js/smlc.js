(function () {
  "use strict";

  const SMLC = {};

  // ===== Fixed astronomical basis =====
  SMLC.TROPICAL_YEAR_DAYS = 365.2421897;
  SMLC.SYNODIC_MONTH_DAYS = 29.530588853;

  // New moon reference (approx): 2000-01-06 18:14 UT
  // Used for phase approximation only.
  SMLC.NEW_MOON_JDN = 2451550.25972;

  // ===== Constants =====
  SMLC.CYCLE_YEARS = 334;
  SMLC.TOTAL_MONTHS = 4131;

  SMLC.MONTH_NAMES = [
    "Eastren","Spryng","Evenmarch","Blossom","Brightmonth","Midsomer",
    "Stillheat","Harvest","Evenfall","Waning","Frostfall","Darkmonth"
  ];

  SMLC.WEEKDAYS = [
    "Foreday","Neistday","Midday","Gangday","Fendday","Restday","Yondday"
  ];

  SMLC.SEASONS = [
    { name:"Spring Equinox", monthIndex:2, day:16 },
    { name:"Summer Solstice", monthIndex:5, day:16 },
    { name:"Autumn Equinox", monthIndex:8, day:16 },
    { name:"Winter Solstice", monthIndex:11, day:16 }
  ];

  // ===== Utils =====
  SMLC.mod = function (a, b) {
    return ((a % b) + b) % b;
  };

  SMLC.formatDayTime = function (daysFloat) {
    const d = Math.floor(daysFloat);
    const frac = daysFloat - d;
    const totalMinutes = Math.round(frac * 24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m`;
  };

  // ===== Gregorian <-> JDN =====
  SMLC.gregorianToJDN = function (y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return (
      d +
      Math.floor((153 * m2 + 2) / 5) +
      365 * y2 +
      Math.floor(y2 / 4) -
      Math.floor(y2 / 100) +
      Math.floor(y2 / 400) -
      32045
    );
  };

  SMLC.jdnToGregorian = function (jdn) {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);

    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = b * 100 + d - 4800 + Math.floor(m / 10);
    return { year, month, day };
  };

  // ===== Epoch =====
  // SMLC Year 1, Eastren 1 = Gregorian 2000-03-20
  SMLC.EPOCH_JDN = SMLC.gregorianToJDN(2000, 3, 20);

  // ===== Leap-month rule =====
  SMLC.isLeapYear = function (y) {
    if (y < 1 || y > SMLC.CYCLE_YEARS) throw new RangeError("Year must be 1–334");
    const A = Math.floor(SMLC.TOTAL_MONTHS * y / SMLC.CYCLE_YEARS);
    const B = Math.floor(SMLC.TOTAL_MONTHS * (y - 1) / SMLC.CYCLE_YEARS);
    return (A - B) === 13;
  };

  // Months alternate 30/29; leap month inserted after Month 6 (index 5), duplicates Month 6.
  SMLC.generateMonths = function (year) {
    const months = [];
    let lunar = 0;
    const leap = SMLC.isLeapYear(year);

    for (let i = 0; i < 12; i++) {
      lunar++;
      months.push({ length: (lunar % 2 ? 30 : 29), leap: false });

      if (leap && i === 5) {
        months.push({ length: (lunar % 2 ? 30 : 29), leap: true });
      }
    }
    return months;
  };

  // Interdays: Yearsend + High Yearsend (in leap-month years)
  SMLC.interdaysCount = function (year) {
    return SMLC.isLeapYear(year) ? 2 : 1;
  };

  // ===== Absolute day conversion =====
  SMLC.daysBeforeYear = function (year) {
    let days = 0;
    for (let y = 1; y < year; y++) {
      SMLC.generateMonths(y).forEach(m => days += m.length);
      days += SMLC.interdaysCount(y);
    }
    return days;
  };

  SMLC.absoluteToSMLC = function (abs) {
    let year = 1;
    while (SMLC.daysBeforeYear(year + 1) <= abs) year++;

    let rem = abs - SMLC.daysBeforeYear(year);
    const months = SMLC.generateMonths(year);

    for (let i = 0; i < months.length; i++) {
      if (rem < months[i].length) {
        return { year, monthIndex: i, day: rem + 1, interday: false };
      }
      rem -= months[i].length;
    }

    const interCount = SMLC.interdaysCount(year);
    if (rem >= 0 && rem < interCount) {
      return {
        year,
        interday: true,
        name: rem === 0 ? "Yearsend" : "High Yearsend"
      };
    }

    throw new Error("absoluteToSMLC(): out of range");
  };

  SMLC.smlcToAbsolute = function (year, month, day) {
    const months = SMLC.generateMonths(year);
    if (month < 1 || month > months.length) throw new RangeError("Month out of range");
    const m = months[month - 1];
    if (day < 1 || day > m.length) throw new RangeError("Day out of range");

    let abs = SMLC.daysBeforeYear(year);
    for (let i = 0; i < month - 1; i++) abs += months[i].length;
    abs += (day - 1);
    return abs;
  };

  SMLC.gregorianToSMLC = function (y, m, d) {
    const jdn = SMLC.gregorianToJDN(y, m, d);
    const abs = jdn - SMLC.EPOCH_JDN;
    return SMLC.absoluteToSMLC(abs);
  };

  SMLC.smlcToGregorian = function (year, month, day) {
    const abs = SMLC.smlcToAbsolute(year, month, day);
    return SMLC.jdnToGregorian(abs + SMLC.EPOCH_JDN);
  };

  // ===== Moon phase (approx) =====
  const PHASES = [
    { name: "New Moon", emoji: "🌑" },
    { name: "Waxing Crescent", emoji: "🌒" },
    { name: "First Quarter", emoji: "🌓" },
    { name: "Waxing Gibbous", emoji: "🌔" },
    { name: "Full Moon", emoji: "🌕" },
    { name: "Waning Gibbous", emoji: "🌖" },
    { name: "Last Quarter", emoji: "🌗" },
    { name: "Waning Crescent", emoji: "🌘" }
  ];

  SMLC.moonPhaseForJDN = function (jdnFloat) {
    const age = SMLC.mod(jdnFloat - SMLC.NEW_MOON_JDN, SMLC.SYNODIC_MONTH_DAYS);
    const phaseFrac = age / SMLC.SYNODIC_MONTH_DAYS;

    // nearest of 8 phases
    const idx = Math.floor(phaseFrac * 8 + 0.5) % 8;

    // simple illumination estimate
    const illum = 0.5 * (1 - Math.cos(2 * Math.PI * phaseFrac));

    return {
      index: idx,
      name: PHASES[idx].name,
      emoji: PHASES[idx].emoji,
      ageDays: age,
      illumination: illum
    };
  };

  // ===== Solar-year position (tropical year) =====
  // "how far through the solar year" relative to epoch equinox
  SMLC.solarYearPosition = function (absDayFloat) {
    const pos = SMLC.mod(absDayFloat, SMLC.TROPICAL_YEAR_DAYS); // 0..TROPICAL
    return {
      daysSinceEpochYearStart: pos,
      fraction: pos / SMLC.TROPICAL_YEAR_DAYS,
      remainingDays: SMLC.TROPICAL_YEAR_DAYS - pos
    };
  };

  // ===== Easter (Meeus/Jones/Butcher) =====
  SMLC.gregorianEaster = function (year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return { month, day };
  };

  // ===== Holidays =====
  SMLC.getHoliday = function (smlcYear, monthIndex, day) {
    const fixed = [
      { m: 0, d: 1, name: "Year Day" },
      { m: 5, d: 16, name: "Midsummer" },
      { m: 11, d: 15, name: "Christmas" }
    ];
    for (const h of fixed) if (h.m === monthIndex && h.d === day) return h.name;

    for (const s of SMLC.SEASONS) {
      if (s.monthIndex === monthIndex && s.day === day) return s.name;
    }

    // boundary-safe gregorian year candidates
    const candidates = [1998 + smlcYear, 1999 + smlcYear, 2000 + smlcYear];

    // Easter
    for (const gy of candidates) {
      const eas = SMLC.gregorianEaster(gy);
      const smlc = SMLC.gregorianToSMLC(gy, eas.month, eas.day);
      if (!smlc.interday && smlc.year === smlcYear && smlc.monthIndex === monthIndex && smlc.day === day) {
        return "Easter";
      }
    }

    // U.S. Independence Day
    for (const gy of candidates) {
      const smlc = SMLC.gregorianToSMLC(gy, 7, 4);
      if (!smlc.interday && smlc.year === smlcYear && smlc.monthIndex === monthIndex && smlc.day === day) {
        return "U.S. Independence Day";
      }
    }

    return null;
  };

  // ===== Today =====
  SMLC.today = function () {
    const now = new Date();
    return {
      now,
      smlc: SMLC.gregorianToSMLC(now.getFullYear(), now.getMonth() + 1, now.getDate())
    };
  };

  window.SMLC = SMLC;
})();
