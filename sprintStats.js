function createSprintStatsBox() {
    const existingBox = document.getElementById("sprint-stats-box");
    if (existingBox) existingBox.remove();

    const box = document.createElement("div");
    box.id = "sprint-stats-box";
    box.style.cssText = `
        position: fixed;
        bottom: auto;    /* remove bottom to avoid conflict with top */
        top: 630px;      /* initial top position */
        left: 20px;
        width: 360px;
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

    // Summary stats
    const summary = document.createElement("div");
    summary.innerHTML = `
        <div style="margin-bottom: 10px;">🗓️ <b>Tickets resolved yesterday:</b> ${yesterdayCount}</div>
        <div style="margin-bottom: 14px;">📊 <b>Total this sprint:</b> ${total}</div>
    `;
    box.appendChild(summary);

    // === Graph with Y-axis and Dots + Line ===
    const graphWrapper = document.createElement("div");
    graphWrapper.style.cssText = `
        position: relative;
        height: 120px;
        margin-bottom: 10px;
        display: flex;
    `;

    // Y-axis container
    const yAxis = document.createElement("div");
    yAxis.style.cssText = `
        width: 30px;
        height: 100px;
        color: #0ff;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 6px;
        user-select: none;
    `;

    const maxY = Math.max(5, ...dailyCounts.map(d => d.val));
    const yTicks = 5; // number of Y axis ticks

    // Create Y-axis ticks and labels
    for (let i = yTicks; i >= 0; i--) {
        const val = Math.round((maxY / yTicks) * i);
        const tick = document.createElement("div");
        tick.textContent = val;
        yAxis.appendChild(tick);
    }

    graphWrapper.appendChild(yAxis);

    // Canvas for graph line and dots
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 100;
    canvas.style.cssText = "background: transparent;";
    graphWrapper.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const padding = 10;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    const pointCount = dailyCounts.length;
    const spacing = graphWidth / (pointCount - 1);

    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    dailyCounts.forEach(({ val }, i) => {
        const x = padding + i * spacing - 9;
        const y = graphHeight - (val / maxY) * graphHeight + padding;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw dots on graph
    dailyCounts.forEach(({ val }, i) => {
        const x = padding + i * spacing - 9;
        const y = graphHeight - (val / maxY) * graphHeight + padding;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#0ff";
        ctx.fill();
    });

    box.appendChild(graphWrapper);

    // X-axis labels (dates)
    const labels = document.createElement("div");
    labels.style.cssText = `display: flex; gap: 4px; justify-content: space-between;`;
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
