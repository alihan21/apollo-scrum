function createSprintMessageBox() {
    const box = document.createElement("div");
    box.id = "sprint-message-box";
    box.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 260px;
        max-height: 300px;
        overflow-y: auto;
        background: rgba(0,0,0,0.85);
        color: #0ff;
        font-size: 14px;
        padding: 12px;
        border: 2px solid #0ff;
        border-radius: 8px;
        z-index: 9999;
    `;

    box.innerHTML = `
        <strong>🚀 Upcoming Deadlines 🚀</strong><br/>
        <ul style="padding-left: 16px; margin-top: 8px;">
            <li>Sprint End: <b>25 July</b></li>
            <li>PCR#58 FAD: <b>31 July</b></li>
            <li>PCR#30 FAD: <b>31 July</b></li>
            <li>PCR#74 FAD: <b>31 July</b></li>
            <li>PCR#55 Delivery: <b>02 August</b></li>
            <li>TEST LAFE WTF</b></li>
        </ul>
    `;
    document.body.appendChild(box);

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
