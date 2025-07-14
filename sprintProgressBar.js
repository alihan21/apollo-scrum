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

    const MS_IN_DAY = 86400000;
    const now = new Date();
    const sprintStartReference = new Date(Date.UTC(2024, 0, 1)); // Jan 1, 2024
    const diff = now - sprintStartReference;
    const daysSinceStart = Math.floor(diff / MS_IN_DAY);
    const sprintDay = daysSinceStart % 14;

    const workingDayIndex = (() => {
        let count = 0;
        for (let i = 0; i <= sprintDay; i++) {
            const dayOfWeek = (sprintStartReference.getUTCDay() + i) % 7;
            if (dayOfWeek >= 1 && dayOfWeek <= 5) count++;
        }
        return count - 1;
    })();

    const daysRemaining = 9 - workingDayIndex;

    // Non-glowing countdown label
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

    for (let i = 0; i < 10; i++) {
        const barWrapper = document.createElement("div");
        barWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        `;

        const label = document.createElement("div");
        label.style.cssText = `
            color: #0ff;
            font-size: 12px;
            margin-bottom: 4px;
            text-align: center;
            height: 16px;
        `;
        label.textContent = i === 0 ? "Sprint Week 1" : (i === 9 ? "Sprint Week 2" : "");

        const bar = document.createElement("div");
        bar.style.cssText = `
            width: 100%;
            height: 20px;
            background: ${i < workingDayIndex
                ? "#0ff"
                : i === workingDayIndex
                    ? "#0f0"
                    : "#444"};
            border-left: ${i === 5 ? "4px solid #0ff" : "none"};
            border-radius: 2px;
            box-shadow: ${i === workingDayIndex ? "0 0 10px 3px #0f0" : "none"};
        `;

        barWrapper.appendChild(label);
        barWrapper.appendChild(bar);
        barRow.appendChild(barWrapper);
    }

    container.appendChild(barRow);
    document.body.appendChild(container);
    makeElementDraggable(container);
}

// Make draggable
// TODO LAFE: move method to Util
function makeElementDraggable(box) {
    box.onmousedown = function (e) {
        const editor = document.getElementById("team-editor");
        if (editor && editor.style.display === "block") return; // skip if editing

        e.preventDefault();
        let shiftX = e.clientX - box.getBoundingClientRect().left;
        let shiftY = e.clientY - box.getBoundingClientRect().top;

        function moveAt(x, y) {
            box.style.left = x - shiftX + 'px';
            box.style.top = y - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };

    box.ondragstart = () => false;
}
