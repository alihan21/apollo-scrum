function createSprintStatsBox() {
    const existingBox = document.getElementById("sprint-stats-box");
    if (existingBox) existingBox.remove();

    const box = document.createElement("div");
    box.id = "sprint-stats-box";
    box.style.cssText = `
    position: fixed;
    bottom: auto;    /* Important: remove bottom to avoid conflict with top */
    top: 630px;      /* or some initial top position */
    left: 20px;
    width: 320px;
    max-height: 350px;
    overflow-y: auto;
    background: rgba(0,0,0,0.85);
    color: #0ff;
    font-size: 14px;
    padding: 16px;
    border: 2px solid #0ff;
    border-radius: 8px;
    z-index: 9999;
    user-select: none;
    cursor: grab;
`;

    // Title with embedded [+] button
    const titleBar = document.createElement("div");
    titleBar.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;";
    titleBar.innerHTML = `<strong style="font-size:16px;">📈 Sprint Ticket Stats</strong>`;

    const addButton = document.createElement("button");
    addButton.textContent = "➕";
    addButton.title = "Log tickets resolved yesterday";
    addButton.style.cssText = `
        background: none;
        color: #0ff;
        border: none;
        font-size: 18px;
        cursor: pointer;
    `;
    addButton.onclick = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split("T")[0];
        const count = prompt(`How many tickets were resolved on ${dateStr}?`);
        if (count && !isNaN(count)) {
            const data = JSON.parse(localStorage.getItem("sprintResolvedStats") || "{}");
            data[dateStr] = Number(count);
            localStorage.setItem("sprintResolvedStats", JSON.stringify(data));
            createSprintStatsBox(); // Refresh
        }
    };
    titleBar.appendChild(addButton);
    box.appendChild(titleBar);

    // Dates of the current sprint (9 working days)
    const sprintDates = window.getCurrentSprintWorkingDates();
    console.log(sprintDates);

    // Pull stored data
    const data = JSON.parse(localStorage.getItem("sprintResolvedStats") || "{}");

    let total = 0;
    let yesterdayCount = 0;
    const yesterdayStr = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
    })();

    const dailyCounts = sprintDates.map(date => {
        const str = date.toISOString().split("T")[0];
        const val = data[str] || 0;
        if (str === yesterdayStr) yesterdayCount = val;
        total += val;
        return { dateStr: str, val };
    });

    const summary = document.createElement("div");
    summary.innerHTML = `
        <div style="margin-bottom: 10px;">🗓️ <b>Tickets resolved yesterday:</b> ${yesterdayCount}</div>
        <div style="margin-bottom: 14px;">📊 <b>Total this sprint:</b> ${total}</div>
    `;
    box.appendChild(summary);

    // Graph
    const graph = document.createElement("div");
    graph.style.cssText = `
        display: flex;
        align-items: flex-end;
        height: 100px;
        gap: 4px;
        margin-bottom: 10px;
    `;

    const maxY = Math.max(5, ...dailyCounts.map(d => d.val));

    dailyCounts.forEach(({ val }) => {
        const bar = document.createElement("div");
        bar.style.cssText = `
            flex: 1;
            height: ${(val / maxY) * 100}px;
            background: #0ff;
            border-radius: 2px;
            box-shadow: 0 0 4px #0ff;
        `;
        graph.appendChild(bar);
    });

    box.appendChild(graph);

    // X-axis labels
    const labels = document.createElement("div");
    labels.style.cssText = "display: flex; gap: 4px;";
    sprintDates.forEach(date => {
        const lbl = document.createElement("div");
        lbl.style.cssText = "flex: 1; font-size: 10px; text-align: center;";
        lbl.textContent = date.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit' });
        labels.appendChild(lbl);
    });
    box.appendChild(labels);

    document.body.appendChild(box);
    makeElementDraggable(box);
}
