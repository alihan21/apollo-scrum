function createSprintMessageBox(goals, messages) {
    // Remove existing box if any
    const oldBox = document.getElementById("sprint-message-box");
    if (oldBox) oldBox.remove();

    // Main container box (draggable)
    const box = document.createElement("div");
    box.id = "sprint-message-box";
    box.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
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
    `;

    // Sprint Goals
    const goalsHtmlList = goals.map(msg => `<li>${msg}</li>`).join("");

    // Sprint Deadlines 
    const messagesHtmlList = messages.map(msg => `<li>${msg}</li>`).join("");

    // Inner HTML with two sections
    box.innerHTML = `
        <div style="margin-bottom: 20px;">
            <strong style="font-size:16px;">🚀 Sprint Goal(s) 🚀</strong>
            <ul style="padding-left: 16px; margin-top: 8px;">
                ${goalsHtmlList}
            </ul>
        </div>
        <div>
            <strong style="font-size:16px;">🚀 Upcoming Deadline(s) 🚀</strong>
            <ul style="padding-left: 16px; margin-top: 8px;">
                ${messagesHtmlList}
            </ul>
        </div>
    `;

    document.body.appendChild(box);

    // Make the entire box draggable
    makeElementDraggable(box);
}

// Make draggable
// TODO LAFE: move this method to Util?
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
