function getHoliday(year, monthIndex, day) {
  // Fixed MLC holidays
  const fixed = [
    { m: 0, d: 1, name: "Year Day" },
    { m: 5, d: 16, name: "Midsummer" },
    { m: 11, d: 15, name: "Christmas" },
  ];

  for (const h of fixed) {
    if (h.m === monthIndex && h.d === day) return h.name;
  }

  // Seasonal anchors
  const seasonal = [
    { m: 2, d: 16, name: "Spring Equinox" },
    { m: 5, d: 16, name: "Summer Solstice" },
    { m: 8, d: 16, name: "Autumn Equinox" },
    { m: 11, d: 16, name: "Winter Solstice" },
  ];

  for (const s of seasonal) {
    if (s.m === monthIndex && s.d === day) return s.name;
  }

  // ✝️ Easter (Gregorian → MLC)
  const gregYear = 1999 + year; // aligns Year 1 ≈ 2000
  const easter = gregorianEaster(gregYear);

  const easterJDN = gregorianToJDN(
    gregYear,
    easter.month,
    easter.day
  );

  const abs = easterJDN - EPOCH_JDN;
  const mlc = absoluteToMLC(abs);

  if (
    mlc.year === year &&
    mlc.monthIndex === monthIndex &&
    mlc.day === day
  ) {
    return "Easter";
  }

  return null;
}
