(function () {
    function slotMachineAnimation(team, onComplete) {
        const old = document.getElementById("scrum-slot-machine");
        if (old) old.remove();

        const board = document.createElement("div");
        board.id = "scrum-slot-machine";
        board.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const machine = document.createElement("div");
        machine.style.cssText = `
            position: relative;
            width: 300px;
            height: 300px;
            overflow: hidden;
            border: 4px solid #0ff;
            border-radius: 16px;
            background: #111;
            box-shadow: 0 0 20px #0ff;
        `;

        const reel = document.createElement("div");
        reel.style.cssText = `
            position: absolute;
            top: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: transform 1s ease-out;
        `;

        const shuffle = [...team, ...team, ...team]; // Repeat to simulate spinning
        shuffle.forEach(name => {
            const item = document.createElement("div");
            item.textContent = name;
            item.style.cssText = `
                width: 100%;
                height: 60px;
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                color: #0ff;
                border-top: 1px solid #0ff22;
                border-bottom: 1px solid #0ff22;
                line-height: 60px;
            `;
            reel.appendChild(item);
        });

        // Highlight center line
        const highlightLine = document.createElement("div");
        highlightLine.style.cssText = `
            position: absolute;
            top: 120px;
            left: 0;
            width: 100%;
            height: 60px;
            border-top: 2px solid #f0f;
            border-bottom: 2px solid #f0f;
            pointer-events: none;
        `;

        machine.appendChild(reel);
        machine.appendChild(highlightLine);
        board.appendChild(machine);
        document.body.appendChild(board);

        // Spin animation
        const finalIndex = Math.floor(Math.random() * team.length);
        const offset = (shuffle.length - finalIndex - 1) * 60;

        setTimeout(() => {
            reel.style.transition = "transform 2s cubic-bezier(0.33, 1, 0.68, 1)";
            reel.style.transform = `translateY(-${offset}px)`;
        }, 100);

        setTimeout(() => {
            const winner = shuffle[shuffle.length - finalIndex - 1];
            board.remove();
            onComplete(winner);
        }, 2200);
    }

    window.apolloSlotMachine = {
        run: slotMachineAnimation
    };
})();
