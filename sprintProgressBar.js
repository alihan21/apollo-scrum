function createSprintProgressBar() {
    const container = document.createElement("div");
    container.id = "sprint-progress-bar";
    container.style.cssText = `
       position: fixed;
       top: 50px;
       left: 50px; /* changed from 50% */
       width: 90%;
       height: 20px;
       background: #222;
       border: 3px solid #0ff;
       border-radius: 8px;
       z-index: 9999;
       display: flex;
       overflow: hidden;
       cursor: grab;
    `;

    const MS_IN_DAY = 86400000;
    const now = new Date();
    const sprintStartReference = new Date(Date.UTC(2024, 0, 1)); // Jan 1, 2024
    const diff = now - sprintStartReference;
    const daysSinceStart = Math.floor(diff / MS_IN_DAY);
    const sprintDay = daysSinceStart % 14;

    // Calculate working day (0-9) → only Mon–Fri × 2
    const workingDayIndex = (() => {
        let count = 0;
        for (let i = 0; i <= sprintDay; i++) {
            const dayOfWeek = (sprintStartReference.getUTCDay() + i) % 7;
            if (dayOfWeek >= 1 && dayOfWeek <= 5) count++;
        }
        return count - 1; // because we counted today too
    })();

    const barContainer = document.createElement("div");
    barContainer.style.cssText = `
        flex: 1;
        display: flex;
        height: 100%;
        gap: 2px;
    `;

    for (let i = 0; i < 10; i++) {
        const bar = document.createElement("div");
        bar.style.flex = "1";
        bar.style.height = "100%";
        bar.style.borderRadius = "2px";
        bar.style.background = i < workingDayIndex
            ? "#0ff"
            : i === workingDayIndex
            ? "#0f0"
            : "#444";

        // Add vertical divider between week 1 and 2
        if (i === 5) {
            bar.style.borderLeft = "2px solid #0ff";
        }

        bar.style.boxShadow = i === workingDayIndex ? "0 0 6px #0f0" : "none";

        barContainer.appendChild(bar);
    }

    const labelLeft = document.createElement("span");
    labelLeft.textContent = "Sprint Week 1";
    labelLeft.style.cssText = `
        color: #0ff;
        font-size: 12px;
        margin-right: 10px;
        white-space: nowrap;
    `;

    const labelRight = document.createElement("span");
    labelRight.textContent = "Sprint Week 2";
    labelRight.style.cssText = `
        color: #0ff;
        font-size: 12px;
        margin-left: 10px;
        white-space: nowrap;
    `;

    container.appendChild(labelLeft);
    container.appendChild(barContainer);
    container.appendChild(labelRight);

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
