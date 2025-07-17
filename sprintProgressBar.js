function createSprintProgressBar() {
    const container = document.createElement("div");
    container.id = "sprint-progress-bar";
    container.style.cssText = `
       position: fixed;
       top: 50px;
       left: 50px;
       width: 90%;
       background: rgba(0,0,0,0.9);
       border: 3px solid #0ff;
       border-radius: 8px;
       z-index: 9999;
       display: flex;
       flex-direction: column;
       align-items: center;
       padding: 10px;
       box-shadow: 0 0 8px #0ff;
       user-select: none;
       cursor: grab;
    `;

    const sprintDates = getCurrentSprintWorkingDates().slice(1); // 9 working days (including Friday (day of sprint planning)
        const todayStr = new Date().toISOString().split("T")[0];

        const workingDayIndex = sprintDates.findIndex(date => {
            return date.toISOString().split("T")[0] === todayStr;
        });

        const daysRemaining = Math.max(0, 8 - workingDayIndex);

    const countdownLabel = document.createElement("div");
    countdownLabel.textContent = `🚀 Sprint ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} 🚀`;
    countdownLabel.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        color: #0ff;
        margin-bottom: 10px;
    `;
    container.appendChild(countdownLabel);

    const barRow = document.createElement("div");
    barRow.style.cssText = `
        display: flex;
        align-items: flex-end;
        width: 100%;
        gap: 4px;
    `;

    for (let i = 0; i < 9; i++) {
        const barWrapper = document.createElement("div");
        barWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            position: relative;
        `;

        const label = document.createElement("div");
        label.style.cssText = `
            color: #0ff;
            font-size: 12px;
            margin-bottom: 4px;
            text-align: center;
            height: 16px;
        `;
        label.textContent = i === 0 ? "Sprint Week 1" : (i === 8 ? "Sprint Week 2" : "");

        const bar = document.createElement("div");
        bar.style.cssText = `
            width: 100%;
            height: 20px;
            background: ${i < workingDayIndex
                ? "#0ff"
                : i === workingDayIndex
                    ? "#0f0"
                    : "#444"};
            border-radius: 2px;
            box-shadow: ${i === workingDayIndex ? "0 0 10px 3px #0f0" : "none"};
        `;

        // Add vertical divider after day 5 (i === 4)
        if (i === 4) {
            const divider = document.createElement("div");
            divider.style.cssText = `
                position: absolute;
                width: 4px;
                height: 36px;
                background: #0ff;
                top: 12px;
                left: 100%;
                transform: translateX(-2px);
                z-index: 1;
                border-radius: 2px;
            `;
            barWrapper.appendChild(divider);
        }

        barWrapper.appendChild(label);
        barWrapper.appendChild(bar);
        barRow.appendChild(barWrapper);
    }

    container.appendChild(barRow);
    document.body.appendChild(container);
    makeElementDraggable(container);
}
