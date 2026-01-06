// ---------- Game Variables ----------
let machines = [
    { name: "Egg Machine", level: 1, baseProduction: 5, upgradeCost: 100 },
    { name: "Grain Mill", level: 0, baseProduction: 20, upgradeCost: 500 },
    { name: "Chicken Factory", level: 0, baseProduction: 50, upgradeCost: 2000 }
];

let eggs = 0;
let lastUpdate = Date.now();

// ---------- DOM Elements ----------
const eggCount = document.getElementById("egg-count");
const machineContainer = document.getElementById("machine-container");

// ---------- Functions ----------
function updateUI() {
    eggCount.textContent = `Eggs: ${Math.floor(eggs)}`;

    machineContainer.innerHTML = "";
    machines.forEach((machine, index) => {
        machineContainer.innerHTML += `
        <div class="machine-card" id="machine-${index}">
            <img src="https://via.placeholder.com/80?text=${machine.name.split(' ')[0]}" alt="${machine.name}" class="machine-img">
            <div class="machine-info">
                <p class="machine-name">${machine.name}</p>
                <p class="machine-level">Level: ${machine.level}</p>
                <p class="machine-production">Production: ${machine.baseProduction * machine.level} eggs/hour</p>
                <button onclick="upgradeMachine(${index})" class="upgrade-btn">⬆️ Upgrade (${machine.upgradeCost} eggs)</button>
            </div>
        </div>
        `;
    });

    updateUpgradeButtons();
}

function upgradeMachine(index) {
    let machine = machines[index];
    if (eggs >= machine.upgradeCost) {
        eggs -= machine.upgradeCost;
        machine.level++;
        machine.upgradeCost = Math.floor(machine.upgradeCost * 1.5);
        showFloatingEggs(machine.baseProduction * machine.level); // Visual effect
        updateUI();
        saveGame();
    } else {
        alert(`❌ Not enough eggs for ${machine.name}`);
    }
}

function idleProduction() {
    const now = Date.now();
    const elapsed = (now - lastUpdate) / 3600000; // hours
    machines.forEach(machine => {
        eggs += elapsed * machine.baseProduction * machine.level;
        showFloatingEggs(elapsed * machine.baseProduction * machine.level); // Visual effect
    });
    lastUpdate = now;
    updateUI();
    saveGame();
}

function updateUpgradeButtons() {
    machines.forEach((machine, index) => {
        const btn = document.querySelector(`#machine-${index} .upgrade-btn`);
        if (eggs >= machine.upgradeCost) {
            btn.classList.add("affordable");
        } else {
            btn.classList.remove("affordable");
        }
    });
}

// ---------- Floating Egg Animation ----------
function showFloatingEggs(amount) {
    if (amount < 1) return;
    const container = document.body;

    const egg = document.createElement("div");
    egg.classList.add("floating-egg");
    egg.textContent = `🥚 +${Math.floor(amount)}`;
    egg.style.left = `${Math.random() * 80 + 10}%`;

    container.appendChild(egg);

    setTimeout(() => {
        egg.remove();
    }, 1500);
}

// ---------- Persistence ----------
function saveGame() {
    localStorage.setItem("eggs", eggs);
    localStorage.setItem("machines", JSON.stringify(machines));
    localStorage.setItem("lastUpdate", lastUpdate);
}

function loadGame() {
    if (localStorage.getItem("eggs")) {
        eggs = parseFloat(localStorage.getItem("eggs"));
        machines = JSON.parse(localStorage.getItem("machines"));
        lastUpdate = parseInt(localStorage.getItem("lastUpdate"));
    }
}

// ---------- Initialization ----------
window.addEventListener("load", () => {
    loadGame();
    updateUI();
    idleProduction();
});

// ---------- Auto Idle ----------
setInterval(idleProduction, 1000);
