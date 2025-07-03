(function () {
    function slotMachineAnimation(team, onComplete) {
        const old = document.getElementById("scrum-slot");
        if (old) old.remove();

        const wrapper = document.createElement("div");
        wrapper.id = "scrum-slot";
        wrapper.style.cssText = `
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

        const reel = document.createElement("div");
        reel.style.cssText = `
            height: 200px;
            width: 200px;
            overflow: hidden;
            border: 4px solid #0ff; /* changed green border to cyan */
            background: #111;
            font-size: 28px;
            font-weight: bold;
            color: #0ff; /* cyan text */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            position: relative;
            border-radius: 16px; /* match pachinko rounded corners */
            box-shadow: 0 0 15px #0ff; /* glow effect */
        `;

        // Add horizontal line with small border, centered vertically to show selection line
        const selectionLine = document.createElement("div");
        selectionLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 3px;
            background: #0ff;
            box-shadow: 0 0 10px #0ff;
            pointer-events: none;
            border-radius: 2px;
            z-index: 10;
        `;
        reel.appendChild(selectionLine);

        const inner = document.createElement("div");
        inner.style.cssText = `
            display: flex;
            flex-direction: column;
            transition: transform 3s cubic-bezier(0.25, 1, 0.5, 1);
        `;

        // Duplicate team names multiple times for better illusion
        const extendedList = [];
        for (let i = 0; i < 20; i++) {
            extendedList.push(...team);
        }

        extendedList.forEach(name => {
            const entry = document.createElement("div");
            entry.textContent = name;
            entry.style.cssText = `
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
            `;
            inner.appendChild(entry);
        });

        reel.appendChild(inner);
        wrapper.appendChild(reel);
        document.body.appendChild(wrapper);

        // Spin
        const targetIndex = Math.floor(Math.random() * team.length);
        const winner = team[targetIndex];
        const finalIndex = extendedList.lastIndexOf(winner);
        const offset = finalIndex * 50;

        // Animate scroll
        requestAnimationFrame(() => {
            inner.style.transform = `translateY(-${offset}px)`;
        });

        setTimeout(() => {
            wrapper.remove();
            onComplete(winner);
        }, 3200);
    }

    window.apolloSlotMachine = {
        run: slotMachineAnimation
    };
})();
