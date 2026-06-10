// =====================================================
// VIDA: BALANCE — FULL UPDATED GAME.JS
// FINAL WORKING VERSION WITH PRE-LOAD NAMING PANEL
// =====================================================

// =====================================================
// BOARD SPACES
// =====================================================
const baseSpaces = [
    { name: "START", icon: "🎯", effect: "+5 ALL", type: "start", mod: {} },
    { name: "COURSE", icon: "📚", effect: "+2 KNOWLEDGE", type: "boost", mod: { knowledge: 2 } },
    { name: "TRAVEL", icon: "✈️", effect: "+2 HAPPINESS", type: "boost", mod: { happiness: 2 } },
    { name: "LIFE EVENT", icon: "🎁", effect: "DRAW CARD", type: "draw" },
    { name: "VOLUNTEER", icon: "🤝", effect: "+1 HAPPINESS", type: "boost", mod: { happiness: 1 } },
    { name: "GYM", icon: "🏃", effect: "+2 HEALTH", type: "boost", mod: { health: 2 } },
    { name: "BUSINESS", icon: "💼", effect: "+3 MONEY", type: "boost", mod: { money: 3 } },
    { name: "HAPPY TIME", icon: "😊", effect: "+1 HAPPINESS", type: "boost", mod: { happiness: 1 } },
    { name: "HEALTHY FOOD", icon: "🍎", effect: "+2 HEALTH", type: "boost", mod: { health: 2 } },
    { name: "MYSTERY", icon: "🔮", effect: "DRAW EVENT", type: "draw" },
    { name: "UNIVERSITY", icon: "🏛️", effect: "+3 KNOWLEDGE", type: "boost", mod: { knowledge: 3 } },
    { name: "RELAX", icon: "🧘", effect: "+1 HEALTH", type: "boost", mod: { health: 1 } },
    { name: "BALANCE", icon: "⚖️", effect: "+1 ALL", type: "boost", mod: { health:1, happiness:1, money:1, knowledge:1 } },
    { name: "FINISH", icon: "🏆", effect: "LAP BONUS!", type: "finish", mod: {} }
];

// Build 36 board spaces dynamically
const boardSpaces = [];
while (boardSpaces.length < 36) {
    baseSpaces.forEach(space => {
        if (boardSpaces.length < 36) {
            boardSpaces.push({ ...space });
        }
    });
}

// =====================================================
// LIFE EVENT CARDS
// =====================================================
const lifeEventCards = [
    { text: "🎉 Lottery Win! +5 Money", mod: { money:5 } },
    { text: "📉 Unexpected Bill: -2 Money", mod: { money:-2 } },
    { text: "🧘 Meditation Retreat: +3 Happiness", mod: { happiness:3 } },
    { text: "🤒 Sickness: -2 Health", mod: { health:-2 } },
    { text: "📖 Learn New Skill: +2 Knowledge", mod: { knowledge:2 } },
    { text: "🚑 Accident: -1 Health, -1 Money", mod: { health:-1, money:-1 } },
    { text: "🏆 Volunteer Award: +2 Happiness, +1 Knowledge", mod: { happiness:2, knowledge:1 } },
    { text: "💸 Lost Wallet: -2 Money", mod: { money:-2 } },
    { text: "👨‍👩‍👧 Family Time: +2 Happiness", mod: { happiness:2 } },
    { text: "😫 Burnout: -2 Health", mod: { health:-2 } },
    { text: "🎓 Scholarship: +3 Knowledge", mod: { knowledge:3 } },
    { text: "🦵 Injury: Skip next turn", type:"skip" },
    { text: "🏝️ Vacation: +3 Happiness", mod: { happiness:3 } },
    { text: "🥗 Healthy Meal Plan: +2 Health", mod: { health:2 } },
    { text: "💻 Side Hustle: +2 Money", mod: { money:2 } },
    { text: "🌈 Life Balance: +1 All Stats", mod: { health:1, happiness:1, money:1, knowledge:1 } }
];

// =====================================================
// GAME STATE
// =====================================================
let players = [];
let currentPlayerIdx = 0;
let roundCount = 0;
let gameActive = false; // Starts as false until "Start Game" triggers it!
let waitingForCard = false;
let soundEnabled = true;

// =====================================================
// DICE FACES
// =====================================================
const diceFaces = [
`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="white"/><circle cx="50" cy="50" r="8"/></svg>`,
`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="white"/><circle cx="28" cy="28" r="8"/><circle cx="72" cy="72" r="8"/></svg>`,
`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="white"/><circle cx="28" cy="28" r="8"/><circle cx="50" cy="50" r="8"/><circle cx="72" cy="72" r="8"/></svg>`,
`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="white"/><circle cx="28" cy="28" r="8"/><circle cx="72" cy="28" r="8"/><circle cx="28" cy="72" r="8"/><circle cx="72" cy="72" r="8"/></svg>`,
`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="white"/><circle cx="28" cy="28" r="8"/><circle cx="72" cy="28" r="8"/><circle cx="50" cy="50" r="8"/><circle cx="28" cy="72" r="8"/><circle cx="72" cy="72" r="8"/></svg>`,
`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="white"/><circle cx="28" cy="25" r="8"/><circle cx="72" cy="25" r="8"/><circle cx="28" cy="50" r="8"/><circle cx="72" cy="50" r="8"/><circle cx="28" cy="75" r="8"/><circle cx="72" cy="75" r="8"/></svg>`
];

// =====================================================
// TOTAL SCORE HELPER
// =====================================================
function getPlayerTotal(player) {
    return (player.health + player.happiness + player.money + player.knowledge);
}

// =====================================================
// BOARD RENDER
// =====================================================
function renderBoard() {
    const grid = document.getElementById("boardGrid");
    if (!grid) return;

    grid.innerHTML = "";
    const width = 12;
    const height = 8;
    const totalCells = width * height;
    const edgeIndices = [];

    for (let x = 0; x < width; x++) edgeIndices.push(x);
    for (let y = 1; y < height - 1; y++) edgeIndices.push(y * width + (width - 1));
    for (let x = width - 1; x >= 0; x--) edgeIndices.push((height - 1) * width + x);
    for (let y = height - 2; y > 0; y--) edgeIndices.push(y * width);

    const layout = Array(totalCells).fill(null);
    boardSpaces.forEach((space, idx) => {
        const pos = edgeIndices[idx];
        if (pos !== undefined) {
            layout[pos] = { idx, space };
        }
    });

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        const data = layout[i];

        if (data) {
            const { idx, space } = data;
            cell.className = "cell";
            cell.innerHTML = `
                <div class="cell-icon">${space.icon}</div>
                <div class="cell-name">${space.name}</div>
                <div class="cell-effect">${space.effect}</div>
                <div class="token-stack" id="cell-tokens-${idx}"></div>
            `;
        } else {
            cell.className = "empty-cell";
        }
        grid.appendChild(cell);
    }
    updateTokensOnBoard();
}

// =====================================================
// TOKENS TRACKING
// =====================================================
function updateTokensOnBoard() {
    for (let i = 0; i < boardSpaces.length; i++) {
        const container = document.getElementById(`cell-tokens-${i}`);
        if (container) container.innerHTML = "";
    }

    players.forEach(player => {
        const container = document.getElementById(`cell-tokens-${player.position}`);
        if (!container) return;

        const token = document.createElement("div");
        token.className = "token-dot";
        token.style.background = player.color;
        token.title = player.name;
        container.appendChild(token);
    });
}

// =====================================================
// PLAYER SIDE PANEL RENDER
// =====================================================
function renderPlayers() {
    const panel = document.getElementById("playersPanel");
    if (!panel) return;

    const avatars = ["🧑","👩","👨","👧","🧔","👩‍💼"];

    panel.innerHTML = players.map((player, idx) => `
        <div class="player-card ${idx === currentPlayerIdx ? 'active-turn' : ''}">
            <div class="player-top">
                <div class="player-avatar" style="border-color:${player.color}">
                    ${avatars[idx % avatars.length]}
                </div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-score">Total: <strong>${getPlayerTotal(player)}</strong></div>
                    <div class="player-score">Laps: ${player.laps}/3</div>
                </div>
            </div>
            <div class="mini-stats">
                <span>❤️ ${player.health}</span>
                <span>😊 ${player.happiness}</span>
                <span>💰 ${player.money}</span>
                <span>📘 ${player.knowledge}</span>
            </div>
        </div>
    `).join("");
}

// =====================================================
// UPDATE UI COUPLER
// =====================================================
function updateUI() {
    renderPlayers();
    updateTokensOnBoard();

    const lapCounter = document.getElementById("lapCounter");
    if (lapCounter) {
        const highestLap = players.length ? Math.max(...players.map(p => p.laps)) : 0;
        lapCounter.innerText = Math.min(highestLap, 3);
    }
    renderScoreSheet();
}

// =====================================================
// MESSAGES & LOG FEED
// =====================================================
function showMessage(msg) {
    const gameMessage = document.getElementById("gameMessage");
    if (gameMessage) {
        gameMessage.innerText = msg;
    }
    addRecentEvent(msg);
}

// Recent action logging queue
function addRecentEvent(text) {
    const container = document.getElementById("recentEvents");
    if (!container) return;

    const item = document.createElement("div");
    item.className = "event-item";
    item.innerText = text;
    container.prepend(item);

    while (container.children.length > 8) {
        container.removeChild(container.lastChild);
    }
}

// =====================================================
// ENGINE MODIFIERS
// =====================================================
function applyMods(player, mods) {
    if (!mods) return;
    player.health = Math.max(0, player.health + (mods.health || 0));
    player.happiness = Math.max(0, player.happiness + (mods.happiness || 0));
    player.money = Math.max(0, player.money + (mods.money || 0));
    player.knowledge = Math.max(0, player.knowledge + (mods.knowledge || 0));
}

// =====================================================
// INITIAL DYNAMIC FORMS AND REGISTRATION
// =====================================================
function generatePlayerInputs() {
    const countInput = document.getElementById("playerCount");
    const container = document.getElementById("playerInputs");
    if (!countInput || !container) return;

    const count = parseInt(countInput.value);
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <input type="text" id="playerName${i}" placeholder="Enter Player ${i} Name">
        `;
    }
}

function startGame() {
    players = [];
    const countInput = document.getElementById("playerCount");
    if (!countInput) return;

    const count = parseInt(countInput.value);
    const colors = ["#ff5252", "#4caf50", "#2196f3", "#ffc107", "#e91e63", "#9c27b0"];

    for (let i = 1; i <= count; i++) {
        const nameEl = document.getElementById(`playerName${i}`);
        let name = nameEl ? nameEl.value.trim() : "";

        if (!name) {
            name = `Player ${i}`;
        }

        players.push({
            name: name,
            health: 10,
            happiness: 10,
            money: 10,
            knowledge: 10,
            position: 0,
            laps: 0,
            skipNext: false,
            color: colors[(i - 1) % colors.length]
        });
    }

    currentPlayerIdx = 0;
    roundCount = 0;
    gameActive = true;
    waitingForCard = false;

    const rollBtn = document.getElementById("rollBtn");
    if (rollBtn) {
        rollBtn.disabled = false;
    }

    renderBoard();
    updateUI();
    renderScoreSheet();

    const startModal = document.getElementById("startGameModal");
    if (startModal) {
        startModal.style.display = "none";
        startModal.classList.remove("active");
    }

    showMessage(`🎮 Game Started! ${players[0].name}'s turn`);
}

// =====================================================
// CARD SYSTEM
// =====================================================
function drawCard(player, callback) {
    const card = lifeEventCards[Math.floor(Math.random() * lifeEventCards.length)];
    const modal = document.getElementById("cardModal");

    document.getElementById("cardMessage").innerHTML = card.text;
    document.getElementById("cardEffects").innerHTML = card.mod
        ? Object.entries(card.mod).map(([k,v]) => `${k}: ${v > 0 ? '+' : ''}${v}`).join(" | ")
        : "Skip next turn";

    modal.classList.add("active");

    const closeBtn = document.getElementById("closeCardBtn");
    closeBtn.onclick = () => {
        modal.classList.remove("active");

        if (card.mod) applyMods(player, card.mod);
        if (card.type === "skip") player.skipNext = true;

        updateUI();
        if (callback) callback();
    };
}

// =====================================================
// ROLL DICE ACTION
// =====================================================
function rollDice() {
    if (!gameActive || waitingForCard) return;

    const player = players[currentPlayerIdx];

    if (player.skipNext) {
        player.skipNext = false;
        showMessage(`${player.name} skips this turn!`);
        nextTurn();
        return;
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    const diceEl = document.getElementById("dice");

    if (diceEl) {
        diceEl.classList.add("rolling");
        setTimeout(() => {
            diceEl.innerHTML = diceFaces[dice - 1];
            diceEl.classList.remove("rolling");
            movePlayer(player, dice);
        }, 500);
    } else {
        movePlayer(player, dice);
    }
}

// =====================================================
// MOVE PLAYER MOTOR
// =====================================================
function movePlayer(player, steps) {
    if (!gameActive) return;

    let newPos = player.position + steps;

    if (newPos >= boardSpaces.length) {
        newPos = newPos % boardSpaces.length;

        if (player.laps < 3) {
            player.laps++;
            applyMods(player, { health: 5, happiness: 5, money: 5, knowledge: 5 });
            showMessage(`🎉 ${player.name} completed Lap ${player.laps}/3`);
        }
    }

    player.position = newPos;
    updateUI();

    if (player.laps >= 3) {
        endGame(player);
        return;
    }

    const space = boardSpaces[player.position];

    setTimeout(() => {
        if (!gameActive) return;

        if (space.type === "draw") {
            waitingForCard = true;
            drawCard(player, () => {
                waitingForCard = false;
                afterLanding(player, space);
            });
        } else {
            afterLanding(player, space);
        }
    }, 300);
}

// =====================================================
// AFTER LANDING RESOLUTION
// =====================================================
function afterLanding(player, space) {
    if (!gameActive) return;

    if (space.type === "boost") {
        applyMods(player, space.mod);
        showMessage(`${player.name}: ${space.effect}`);
    }

    updateUI();

    if (gameActive && !waitingForCard) {
        nextTurn();
    }
}

// =====================================================
// NEXT TURN LOOP STEPPER
// =====================================================
function nextTurn() {
    if (!gameActive) return;

    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    roundCount++;
    updateUI();
    showMessage(`🎲 ${players[currentPlayerIdx].name}'s turn`);
}

// =====================================================
// WINNER SUMMARY FRAME
// =====================================================
function showWinnerModal(winner) {
    const modal = document.getElementById("winnerModal");
    const title = document.getElementById("winnerTitle");
    const stats = document.getElementById("winnerStats");

    if (!modal || !title || !stats) {
        console.error("Winner modal elements missing!");
        return;
    }

    title.innerHTML = `🏆 ${winner.name} Wins!`;
    stats.innerHTML = `
        <div class="winner-stat">❤️ Health: ${winner.health}</div>
        <div class="winner-stat">😊 Happiness: ${winner.happiness}</div>
        <div class="winner-stat">💰 Money: ${winner.money}</div>
        <div class="winner-stat">📘 Knowledge: ${winner.knowledge}</div>
        <div class="winner-stat total">⭐ Total Score: ${getPlayerTotal(winner)}</div>
    `;

    modal.style.display = "flex";
    modal.classList.add("active");
}

// =====================================================
// END GAME SEQUENCE
// =====================================================
function endGame(winner) {
    if (!gameActive) return;

    gameActive = false;
    const rollBtn = document.getElementById("rollBtn");
    if (rollBtn) {
        rollBtn.disabled = true;
    }

    renderScoreSheet();
    showMessage(`🏆 ${winner.name} wins the game!`);

    setTimeout(() => {
        showWinnerModal(winner);
    }, 300);
}

// =====================================================
// SCORE SHEET GENERATOR - UPDATED WIDE VERSION
// =====================================================
function renderScoreSheet() {
    const content = document.getElementById("scoreSheetContent");
    if (!content) {
        console.error("scoreSheetContent missing!");
        return;
    }

    if (players.length === 0) {
        content.innerHTML = `
            <div class="empty-score">
                No scores yet. Fill fields and tap Start Game!
            </div>
        `;
        return;
    }

    const sortedPlayers = [...players].sort((a, b) => getPlayerTotal(b) - getPlayerTotal(a));

    // Using HTML table for better width control and non-squeezing layout
    let html = `
        <table class="score-sheet-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>PLAYER</th>
                    <th>LAPS</th>
                    <th>❤️</th>
                    <th>😊</th>
                    <th>💰</th>
                    <th>📘</th>
                    <th>TOTAL</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedPlayers.forEach((player, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td class="player-name-cell">${player.name}</td>
                <td>${player.laps}/3</td>
                <td>${player.health}</td>
                <td>${player.happiness}</td>
                <td>${player.money}</td>
                <td>${player.knowledge}</td>
                <td class="total-cell"><strong>${getPlayerTotal(player)}</strong></td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    content.innerHTML = html;
}

// =====================================================
// ENGINE MODALS HANDLERS
// =====================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "flex";
        modal.classList.add("active");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("active");
        modal.style.display = "none";
    }
}

// =====================================================
// BACKGROUND TRACK MANAGEMENT
// =====================================================
const bgMusic = document.getElementById("bgMusic");
if (bgMusic) {
    bgMusic.volume = 0.35;
    document.body.addEventListener("click", () => {
        bgMusic.play()
            .then(() => console.log("Music playing"))
            .catch(err => console.log("Autoplay blocked:", err));
    }, { once: true });
}

// =====================================================
// APPLICATION CONTEXT INITIALIZATION LINK
// =====================================================
window.onload = () => {
    // Generate board outline and setup input listeners safely
    renderBoard();
    generatePlayerInputs();
    renderScoreSheet();

    // PLAYER SELECTION DROPDOWN UPDATE TRACKER
    const playerCountSelect = document.getElementById("playerCount");
    if (playerCountSelect) {
        playerCountSelect.addEventListener("change", generatePlayerInputs);
    }

    // GAME ENGINE TRIGGER SWITCH
    const startGameBtn = document.getElementById("startGameBtn");
    if (startGameBtn) {
        startGameBtn.addEventListener("click", startGame);
    }

    // ROLL INTERCEPT
    const rollBtn = document.getElementById("rollBtn");
    if (rollBtn) {
        rollBtn.addEventListener("click", rollDice);
    }

    // SCORE MODAL DISPLAY ACTUATOR
    const viewScoreBtn = document.getElementById("viewScoreBtn");
    if (viewScoreBtn) {
        viewScoreBtn.addEventListener("click", () => {
            renderScoreSheet();
            openModal("scoreModal");
        });
    }

    // INTERFACES EXIT AND CLEANING CLOSURES
    const closeScoreBtn = document.getElementById("closeScoreBtn");
    if (closeScoreBtn) {
        closeScoreBtn.addEventListener("click", () => closeModal("scoreModal"));
    }

    const closeWinnerBtn = document.getElementById("closeWinnerBtn");
    if (closeWinnerBtn) {
        closeWinnerBtn.addEventListener("click", () => closeModal("winnerModal"));
    }

    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => openModal("settingsModal"));
    }

    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener("click", () => closeModal("settingsModal"));
    }

    const guideBtn = document.getElementById("guideBtn");
    if (guideBtn) {
        guideBtn.addEventListener("click", () => openModal("guideModal"));
    }

    const closeGuideBtn = document.getElementById("closeGuideBtn");
    if (closeGuideBtn) {
        closeGuideBtn.addEventListener("click", () => closeModal("guideModal"));
    }

    // SOUND UTILITY
    const soundBtn = document.getElementById("soundBtn");
    if (soundBtn) {
        soundBtn.onclick = () => {
            soundEnabled = !soundEnabled;
            soundBtn.innerHTML = soundEnabled ? "🔊" : "🔇";

            if (bgMusic) {
                if (soundEnabled) {
                    bgMusic.play().catch(() => {});
                } else {
                    bgMusic.pause();
                }
            }
            showMessage(soundEnabled ? "🔊 Sound Enabled" : "🔇 Sound Disabled");
        };
    }
};