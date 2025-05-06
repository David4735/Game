// js/crafting.js
import { craftingRecipes, resources, BALANCE } from './gameData.js';
import { updateInventory, addToBattleLog, animateCraftingResult } from './ui.js';

let craftingMaterials = {};
let craftingLevel = 1;
let activeCraftingBuffs = [];

function initCrafting() {
    resources.forEach(res => {
        craftingMaterials[res.name] = 0;
    });
    initCraftingEvents();
}

function initCraftingEvents() {
    document.querySelectorAll('.craft-btn').forEach(btn => {
        btn.addEventListener('click', handleCrafting);
    });
}

function handleCrafting(e) {
    const recipeName = e.target.dataset.recipe;
    const recipe = craftingRecipes.find(r => r.item === recipeName);
    
    if (recipe) {
        craftItem(recipe);
        // 5% шанс получить улучшенный предмет
        if (Math.random() < 0.05 * craftingLevel) {
            const upgradedItem = getUpgradedItem(recipe.item);
            player.inventory.push(upgradedItem);
            addToBattleLog(`Создан улучшенный ${upgradedItem}!`);
        }
    }
}

function gatherMaterials() {
    resources.forEach(res => {
        if (Math.random() < res.dropChance * getGatheringMultiplier()) {
            craftingMaterials[res.name]++;
            addToBattleLog(`Найден ${res.name}!`);
        }
    });
    updateCraftingUI();
}

function getGatheringMultiplier() {
    let multiplier = 1;
    if (player.race === 'dwarf') multiplier *= 1.3;
    if (activeCraftingBuffs.includes('gathering_boost')) multiplier *= 1.5;
    return multiplier;
}

function craftItem(recipe) {
    const baseSuccessChance = recipe.chance + (craftingLevel * 0.02);
    const successChance = Math.min(baseSuccessChance, 0.95);

    if (!hasMaterials(recipe)) {
        animateCraftingResult('error');
        addToBattleLog('Недостаточно материалов!');
        return;
    }

    if (Math.random() < successChance) {
        consumeMaterials(recipe);
        handleSuccessfulCraft(recipe);
        craftingLevel += 0.1;
    } else {
        handleFailedCraft(recipe);
    }

    updateCraftingUI();
    updateInventory();
}

function hasMaterials(recipe) {
    return recipe.ingredients.every(ing => 
        craftingMaterials[ing.name] >= ing.quantity
    );
}

function consumeMaterials(recipe) {
    recipe.ingredients.forEach(ing => {
        craftingMaterials[ing.name] -= ing.quantity;
    });
}

function handleSuccessfulCraft(recipe) {
    player.inventory.push(recipe.item);
    addToBattleLog(`Успешно создан ${recipe.item}!`);
    animateCraftingResult('success');
    
    if (recipe.buff) {
        applyCraftingBuff(recipe.buff);
    }
}

function handleFailedCraft(recipe) {
    addToBattleLog('Крафт не удался!');
    animateCraftingResult('fail');
    
    // 30% шанс сохранить часть материалов
    if (Math.random() < 0.3) {
        recipe.ingredients.forEach(ing => {
            craftingMaterials[ing.name] += Math.floor(ing.quantity * 0.5);
        });
        addToBattleLog('Удалось спасти часть материалов!');
    }
}

function applyCraftingBuff(buff) {
    activeCraftingBuffs.push(buff.type);
    setTimeout(() => {
        activeCraftingBuffs = activeCraftingBuffs.filter(b => b !== buff.type);
    }, buff.duration * 60000);
}

function getUpgradedItem(baseItem) {
    const upgrades = {
        'Зелье здоровья': 'Большое зелье здоровья (+50 HP)',
        'Меч рыцаря': 'Зачарованный меч рыцаря',
    };
    return upgrades[baseItem] || baseItem;
}

function updateCraftingUI() {
    const materialsContainer = document.getElementById('materials-list');
    const recipesContainer = document.getElementById('recipes-container');
    
    // Обновление материалов
    materialsContainer.innerHTML = Object.entries(craftingMaterials)
        .map(([name, qty]) => `
            <div class="material-item">
                <span>${name}</span>
                <span class="quantity">${qty}</span>
            </div>
        `).join('');

    // Обновление рецептов
    recipesContainer.innerHTML = craftingRecipes.map(recipe => `
        <div class="recipe-card">
            <h4>${recipe.item}</h4>
            <div class="ingredients">
                ${recipe.ingredients.map(ing => `
                    <div class="ingredient">
                        <img src="img/${ing.name}.png" alt="${ing.name}">
                        <span>${ing.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <button class="craft-btn" data-recipe="${recipe.item}">
                Создать (${(recipe.chance * 100).toFixed(0)}%)
            </button>
        </div>
    `).join('');
}

export { 
    initCrafting, 
    gatherMaterials, 
    craftItem, 
    updateCraftingUI, 
    craftingLevel,
    activeCraftingBuffs
};