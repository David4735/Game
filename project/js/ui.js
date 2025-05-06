// js/ui.js
import { currentPrices, getFinalPrice } from './shop.js';
import { craftItem, updateCraftingUI, craftingMaterials } from './crafting.js';
import { attack, generateNewEnemy, player, enemy } from './gameLogic.js';

// Инициализация интерфейса
function initUI() {
    createMissChanceIndicator();
    createPriceInflationIndicator();
    createActionButtons();
    initInventoryPanel();
    initCraftingPanel();
    initShopPanel();
    updateAllUI();
}

// Создание кнопок действий
function createActionButtons() {
    const controls = document.createElement('div');
    controls.className = 'action-buttons';
    
    const attackBtn = document.createElement('button');
    attackBtn.id = 'attack-btn';
    attackBtn.textContent = 'Атаковать';
    attackBtn.addEventListener('click', attack);
    
    const craftBtn = document.createElement('button');
    craftBtn.textContent = 'Крафтить';
    craftBtn.addEventListener('click', showCraftingPanel);
    
    controls.append(attackBtn, craftBtn);
    document.body.append(controls);
}

// Панель инвентаря
function initInventoryPanel() {
    const panel = document.createElement('div');
    panel.id = 'inventory-panel';
    
    const title = document.createElement('h3');
    title.textContent = 'Инвентарь';
    
    const list = document.createElement('div');
    list.id = 'inventory-list';
    
    panel.append(title, list);
    document.body.append(panel);
}

// Обновление информации игрока
function updatePlayerInfo() {
    document.getElementById('player-health').textContent = player.health;
    document.getElementById('player-gold').textContent = player.gold;
    document.getElementById('miss-chance').textContent = 
        `Шанс промаха: ${Math.round(BALANCE.MISS_CHANCE * 100)}%`;
}

// Обновление информации врага
function updateEnemyHealth() {
    const healthBar = document.getElementById('enemy-health-bar');
    const percent = (enemy.health / enemy.maxHealth) * 100;
    healthBar.style.width = `${percent}%`;
}

// Обновление инвентаря
function updateInventory() {
    const list = document.getElementById('inventory-list');
    list.innerHTML = player.inventory
        .map(item => `<div class="item">${item}</div>`)
        .join('');
}

// Анимации
function animateDamage(target, amount) {
    const elem = document.createElement('div');
    elem.className = 'damage-animation';
    elem.textContent = `-${amount}`;
    target.append(elem);
    
    setTimeout(() => elem.remove(), 1000);
}

function showPriceChange(item, oldPrice, newPrice) {
    const element = document.querySelector(`[data-item="${item}"] .price`);
    const changeElem = document.createElement('div');
    changeElem.className = 'price-change';
    changeElem.textContent = `${oldPrice} → ${newPrice}`;
    
    element.append(changeElem);
    setTimeout(() => changeElem.remove(), 2000);
}

// Экспорт функций
export { 
    initUI,
    updatePlayerInfo,
    updateEnemyHealth,
    updateInventory,
    animateDamage,
    showPriceChange,
    createMissChanceIndicator,
    createPriceInflationIndicator,
    updateAllUI
};