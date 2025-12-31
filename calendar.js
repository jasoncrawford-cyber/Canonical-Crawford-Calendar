// ===============================
// Crawford Calendar — Core Logic
// ===============================

// Simple canonical mapping for now
// (No lunar math yet — this is intentional)

function crawfordFromDate(date) {
  // TEMPORARY canonical anchor:
  // Gregorian Jan 1, 2025 → 1 Waning
  const epoch = new Date(2025, 0, 1);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor((date - epoch) / msPerDay);

  const months = [
    { name: "Eastren", length: 30 },
    { name: "Spryng", length: 29 },
    { name: "Evenmarch", length: 30 },
    { name: "Blossom", length: 29 },
    { name: "Brightmonth", length: 30 },
    { name: "Midsomer", length: 29 },
    { name: "High Midsomer", length: 29 },
    { name: "Stillheat", length: 30 },
    { name: "Harvest", length: 29 },
    { name: "Evenfall", length: 30 },
    { name: "Waning", length: 29 },
    { name: "Frostfall", length: 30 },
    { name: "Darkmonth", length: 29 }
  ];

  let dayCount = daysSinceEpoch;
  let year = 1;
  let monthIndex = 0;

  while (dayCount >= months[monthIndex].length) {
    dayCount -= months[monthIndex].length;
    monthIndex++;
    if (monthIndex >= months.length) {
      monthIndex = 0;
      year++;
    }
  }

  return {
    year,
    month: months[monthIndex].name,
    day: dayCount + 1,
    holiday: null
  };
}

