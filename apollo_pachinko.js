function pachinkoAnimation(team, onComplete) {
    // remove old board
    const old = document.getElementById("scrum-pachinko");
    if (old) old.remove();

    const board = document.createElement("div");

    board.id = "scrum-pachinko";
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

    // Create pachinko container
    const game = document.createElement("div");
    game.style.cssText = `
        position: relative;
        width: 400px;
        height: 500px;
        background: #111;
        border: 4px solid #0ff;
        border-radius: 16px;
        overflow: hidden;
    `;

    // Bottom slots
    const slotWidth = 400 / team.length;
    team.forEach((name, i) => {
        const slot = document.createElement("div");
        slot.textContent = name;
        slot.style.cssText = `
            position: absolute;
            bottom: 0;
            left: ${i * slotWidth}px;
            width: ${slotWidth}px;
            height: 60px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: #0ff;
            border-top: 2px solid #0ff;
            line-height: 60px;
        `;
        game.appendChild(slot);
    });

    // Add obstacles
    for (let i = 0; i < 20; i++) {
        const peg = document.createElement("div");
        peg.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #0ff;
            top: ${50 + Math.floor(i / 5) * 40}px;
            left: ${30 + (i % 5) * 70 + (Math.random() * 10 - 5)}px;
        `;
        game.appendChild(peg);
    }

    // Add the ball
    const ball = document.createElement("div");
    ball.style.cssText = `
        position: absolute;
        top: 0;
        left: 180px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f0f;
        transition: top 0.05s linear;
    `;
    game.appendChild(ball);

    board.appendChild(game);
    document.body.appendChild(board);

    // Ball physics (simple gravity + bounce sideways)
    let posY = 0;
    let posX = 180;
    let dx = 0;
    let interval = setInterval(() => {
        posY += 5;
        if (Math.random() < 0.3) dx += (Math.random() < 0.5 ? -1 : 1) * 10;
        posX = Math.max(0, Math.min(380, posX + dx * 0.1));

        ball.style.top = `${posY}px`;
        ball.style.left = `${posX}px`;

        if (posY >= 440) {
            clearInterval(interval);
            const index = Math.floor(posX / slotWidth);
            const winner = team[index];

            setTimeout(() => {
                board.remove();
                onComplete(winner);
            }, 1000);
        }
    }, 30);

    window.apolloPachinko = {
        run: pachinkoAnimation
    };
}
