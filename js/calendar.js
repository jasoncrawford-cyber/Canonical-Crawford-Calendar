function render() {
  const year = parseInt(document.getElementById("yearInput").value, 10);
  const months = generateMonths(year);
  const output = document.getElementById("output");

  output.innerHTML = "";

  months.forEach((month) => {
    const h = document.createElement("h3");
    h.textContent = `${month.name} (${month.length} days)`;
    output.appendChild(h);

    const grid = document.createElement("div");
    grid.className = "calendar";

    for (let d = 1; d <= month.length; d++) {
      const day = document.createElement("div");
      day.className = "day";

      const weekday = WEEKDAYS[(d - 1) % 7];
      if (weekday === "Restday" || weekday === "Yondday") {
        day.classList.add("rest");
      }

      day.textContent = `${d} – ${weekday}`;
      grid.appendChild(day);
    }

    output.appendChild(grid);
  });
}
