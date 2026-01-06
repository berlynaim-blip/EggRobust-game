// ---------- Phaser Game Config ----------
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

// ---------- Variables ----------
let player, cursors, machines = [], eggs = 0;
const overlayContainer = document.getElementById('overlay-container');
const eggCounter = document.getElementById('egg-counter');

// ---------- Machine Data ----------
const machineData = [
    { name: "Egg Machine", x: 200, y: 200, level: 1, baseProduction: 5, upgradeCost: 100 },
    { name: "Grain Mill", x: 500, y: 400, level: 0, baseProduction: 20, upgradeCost: 500 },
];

// ---------- Preload ----------
function preload() {
    this.load.image('player', 'https://via.placeholder.com/50?text=👨‍🌾');
    this.load.image('machine', 'https://via.placeholder.com/80?text=🏭');
    this.load.image('grass', 'https://via.placeholder.com/1600x1200/7ec850/ffffff?text=Grass');
}

// ---------- Create ----------
function create() {
    // Background
    this.add.tileSprite(400, 300, 1600, 1200, 'grass');

    // Player
    player = this.physics.add.sprite(100, 100, 'player');
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    // Create machines
    machineData.forEach(data => {
        const machine = this.add.sprite(data.x, data.y, 'machine').setInteractive();
        machine.data = data;
        machine.lastProduced = Date.now();
        machine.on('pointerdown', () => collectEggs(machine));
        machines.push(machine);

        // Upgrade button (DOM)
        const btn = document.createElement('button');
        btn.className = 'upgrade-btn';
        btn.innerText = `Upgrade (${data.upgradeCost})`;
        btn.onclick = () => upgradeMachine(machine);
        overlayContainer.appendChild(btn);
        machine.btn = btn;
    });

    // Load save
    loadGame();
}

// ---------- Update ----------
function update() {
    const speed = 200;
    player.body.setVelocity(0);
    if (cursors.left.isDown) player.body.setVelocityX(-speed);
    if (cursors.right.isDown) player.body.setVelocityX(speed);
    if (cursors.up.isDown) player.body.setVelocityY(-speed);
    if (cursors.down.isDown) player.body.setVelocityY(speed);

    // Idle production
    machines.forEach(machine => {
        const now = Date.now();
        const elapsed = (now - machine.lastProduced) / 1000;
        if (elapsed >= 1) {
            const produced = machine.data.baseProduction * machine.data.level * elapsed;
            eggs += produced;
            showFloatingEggs(machine.x, machine.y - 50, produced);
            machine.lastProduced = now;
        }

        // Position upgrade button
        const rect = game.canvas.getBoundingClientRect();
        const scaleX = rect.width / game.config.width;
        const scaleY = rect.height / game.config.height;
        machine.btn.style.left = (machine.x * scaleX + rect.left - 40) + 'px';
        machine.btn.style.top = (machine.y * scaleY + rect.top + 40) + 'px';
        machine.btn.innerText = `Upgrade (${machine.data.upgradeCost})`;
    });

    eggCounter.innerText = `Eggs: ${Math.floor(eggs)}`;

    saveGame();
}

// ---------- Collect Eggs ----------
function collectEggs(machine) {
    const produced = machine.data.baseProduction * machine.data.level;
    eggs += produced;
    showFloatingEggs(machine.x, machine.y - 50, produced);
}

// ---------- Upgrade Machine ----------
function upgradeMachine(machine) {
    if (eggs >= machine.data.upgradeCost) {
        eggs -= machine.data.upgradeCost;
        machine.data.level++;
        machine.data.upgradeCost = Math.floor(machine.data.upgradeCost * 1.5);
    } else {
        alert("Not enough eggs!");
    }
}

// ---------- Floating Eggs (DOM) ----------
function showFloatingEggs(x, y, amount) {
    const floatDiv = document.createElement('div');
    floatDiv.className = 'floating-egg';
    floatDiv.innerText = `🥚 +${Math.floor(amount)}`;
    overlayContainer.appendChild(floatDiv);

    const rect = game.canvas.getBoundingClientRect();
    floatDiv.style.left = rect.left + x - 10 + 'px';
    floatDiv.style.top = rect.top + y - 10 + 'px';

    // Remove after animation
    setTimeout(() => overlayContainer.removeChild(floatDiv), 1000);
}

// ---------- Save & Load ----------
function saveGame() {
    localStorage.setItem('eggs', eggs);
    localStorage.setItem('machines', JSON.stringify(machineData));
    localStorage.setItem('playerX', player.x);
    localStorage.setItem('playerY', player.y);
}

function loadGame() {
    const savedEggs = localStorage.getItem('eggs');
    const savedMachines = localStorage.getItem('machines');
    const savedX = localStorage.getItem('playerX');
    const savedY = localStorage.getItem('playerY');

    if (savedEggs) eggs = parseFloat(savedEggs);
    if (savedMachines) {
        const saved = JSON.parse(savedMachines);
        for (let i = 0; i < machineData.length; i++) {
            machineData[i].level = saved[i].level;
            machineData[i].upgradeCost = saved[i].upgradeCost;
        }
    }
    if (savedX && savedY) {
        player.x = parseFloat(savedX);
        player.y = parseFloat(savedY);
    }
}
