// Game state
const gameState = {
    coins: 100,
    level: 1,
    plots: [],
    selectedCrop: null
};

// Crop types and their properties
const crops = {
    carrot: {
        name: 'Carrot',
        growthTime: 10000, // 10 seconds
        cost: 10,
        reward: 20
    },
    tomato: {
        name: 'Tomato',
        growthTime: 15000, // 15 seconds
        cost: 20,
        reward: 40
    },
    potato: {
        name: 'Potato',
        growthTime: 20000, // 20 seconds
        cost: 30,
        reward: 60
    }
};

// Initialize game
function initGame() {
    // Create farm grid
    const farmGrid = document.getElementById('farm-grid');
    for (let i = 0; i < 16; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.dataset.index = i;
        plot.addEventListener('click', () => plantCrop(i));
        farmGrid.appendChild(plot);
        gameState.plots[i] = null;
    }

    // Add shop item listeners
    document.querySelectorAll('.shop-item').forEach(item => {
        item.addEventListener('click', () => {
            gameState.selectedCrop = item.dataset.crop;
        });
    });

    // Add harvest all button listener
    document.getElementById('harvestAll').addEventListener('click', harvestAllCrops);

    // Update display
    updateDisplay();
}

// Plant crop in a plot
function plantCrop(plotIndex) {
    if (!gameState.selectedCrop || gameState.plots[plotIndex]) return;
    
    const crop = crops[gameState.selectedCrop];
    if (gameState.coins < crop.cost) {
        showMessage("Not enough coins!");
        return;
    }

    gameState.coins -= crop.cost;
    const plot = document.querySelectorAll('.plot')[plotIndex];
    plot.classList.add('growing');
    
    gameState.plots[plotIndex] = {
        type: gameState.selectedCrop,
        plantTime: Date.now(),
        ready: false
    };

    setTimeout(() => {
        if (gameState.plots[plotIndex]) {
            gameState.plots[plotIndex].ready = true;
            plot.classList.remove('growing');
            plot.classList.add('ready');
        }
    }, crop.growthTime);

    updateDisplay();
}

// Harvest all ready crops
function harvestAllCrops() {
    let harvestedAny = false;
    gameState.plots.forEach((plot, index) => {
        if (plot && plot.ready) {
            harvestCrop(index);
            harvestedAny = true;
        }
    });
    
    if (!harvestedAny) {
        showMessage("No crops ready to harvest!");
    }
}

// Harvest individual crop
function harvestCrop(plotIndex) {
    const plot = gameState.plots[plotIndex];
    if (!plot || !plot.ready) return;

    const crop = crops[plot.type];
    gameState.coins += crop.reward;
    
    // Clear plot
    gameState.plots[plotIndex] = null;
    const plotElement = document.querySelectorAll('.plot')[plotIndex];
    plotElement.className = 'plot';

    // Check for level up
    if (gameState.coins >= gameState.level * 100) {
        gameState.level++;
        showMessage(`Level Up! You're now level ${gameState.level}`);
    }

    updateDisplay();
}

// Update display
function updateDisplay() {
    document.getElementById('coins').textContent = gameState.coins;
    document.getElementById('level').textContent = gameState.level;
}

// Show message in tutorial area
function showMessage(message) {
    const tutorial = document.getElementById('tutorial');
    tutorial.textContent = message;
    setTimeout(() => {
        tutorial.textContent = "Click on a plot to plant seeds!";
    }, 3000);
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initGame);

class MangoTree {
    constructor() {
        this.mangoCount = 0;  // Initially no mangoes
    }

    growMango() {
        this.mangoCount++;
        console.log(`A mango has grown! Total mangoes: ${this.mangoCount}`);
    }

    harvestMango() {
        if (this.mangoCount > 0) {
            this.mangoCount--;
            console.log(`A mango has been harvested! Remaining mangoes: ${this.mangoCount}`);
        } else {
            console.log("No mangoes to harvest!");
        }
    }

    harvestAllMangoes() {
        if (this.mangoCount > 0) {
            console.log(`${this.mangoCount} mangoes have been harvested!`);
            this.mangoCount = 0; // All mangoes are harvested
        } else {
            console.log("No mangoes to harvest!");
        }
    }
}

class Farm {
    constructor() {
        this.trees = [];
    }

    plantTree() {
        const newTree = new MangoTree();
        this.trees.push(newTree);
        console.log("A new mango tree has been planted!");
    }

    growMangoes() {
        this.trees.forEach(tree => tree.growMango());
    }

    harvestMangoes() {
        this.trees.forEach(tree => tree.harvestMango());
    }

    harvestAllMangoes() {
        this.trees.forEach(tree => tree.harvestAllMangoes());
    }
}

// Game Simulation
const myFarm = new Farm();
myFarm.plantTree();          // Planting one tree
myFarm.growMangoes();        // Growing one mango on each tree
myFarm.harvestMangoes();     // Harvesting one mango from each tree
myFarm.harvestMangoes();     // Attempting to harvest another mango (should show "No mangoes to harvest!")
myFarm.growMangoes();        // Growing more mangoes
myFarm.harvestAllMangoes();  // Harvesting all mangoes from all trees
