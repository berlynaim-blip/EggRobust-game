// -----------------------------
// Game Variables
// -----------------------------
let eggs = 0;
let machineLevel = 1;
let baseProduction = 5; // eggs per hour
let lastUpdate = Date.now();
let upgradeCost = 100;

// -----------------------------
// DOM Elements
// -----------------------------
const eggCount = document.getElementById("egg-count");
const machineLevelText = document.getElementById("machine-level");
const productionRateText = document.getElementById("production-rate");
const collectBtn = document.getElementById("collect-btn");
const upgradeBtn = document.getElementById("upgrade-btn");

// -----------------------------
// Functions
// -----------------------------
function updateUI() {
    eggCount.textContent = `Eggs: ${Math.floor(eggs)}`;
    machineLevelText.textContent = `Machine Level: ${machineLevel}`;
    productionRateText.textContent = `Production: ${baseProduction * machineLevel} eggs/hour`;
}

function collectEggs() {
    eggs += baseProduction * machineLevel / 60; // collect manually (1 min worth)
    updateUI();
}

function upgradeMachine() {
    if (eggs >= upgradeCost) {
        eggs -= upgradeCost;
        machineLevel++;
        upgradeCost = Math.floor(upgradeCost * 1.5);
        updateUI();
    } else {
        alert(`❌ Not enough eggs! Need ${upgradeCost} eggs.`);
    }
}

function idleProduction() {
    const now = Date.now();
    const elapsed = (now - lastUpdate) / 3600000; // hours passed
    eggs += elapsed * baseProduction * machineLevel;
    lastUpdate = now;
    updateUI();
}

// -----------------------------
// Event Listeners
// -----------------------------
collectBtn.addEventListener("click", collectEggs);
upgradeBtn.addEventListener("click", upgradeMachine);

// -----------------------------
// Auto Update
// -----------------------------
setInterval(idleProduction, 1000); // update every second

// -----------------------------
// Save/Load Progress
// -----------------------------
function saveGame() {
    localStorage.setItem("eggs", eggs);
    localStorage.setItem("machineLevel", machineLevel);
    localStorage.setItem("lastUpdate", lastUpdate);
}

function loadGame() {
    if (localStorage.getItem("eggs")) {
        eggs = parseFloat(localStorage.getItem("eggs"));
        machineLevel = parseInt(localStorage.getItem("machineLevel"));
        lastUpdate = parseInt(localStorage.getItem("lastUpdate"));
    }
}

window.addEventListener("beforeunload", saveGame);
window.addEventListener("load", () => {
    loadGame();
    updateUI();
});
