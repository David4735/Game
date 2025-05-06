// js/shop.js
import { basePrices, BALANCE, items } from './gameData.js';
import { 
    updatePlayerInfo, 
    addToBattleLog, 
    showPriceChange,
    updateEquipment
} from './ui.js';

let currentPrices = JSON.parse(JSON.stringify(basePrices));

// Динамическое изменение цен
function calculateNewPrice(itemKey) {
    const inflation = 1 + (Math.random() * 0.02 + 0.05); // 5-7%
    const maxPrice = basePrices[itemKey].base * 3; // Макс. цена в 3 раза выше базовой
    
    return Math.min(
        maxPrice,
        Math.floor(currentPrices[itemKey].current * inflation)
    );
}

function buyItem(itemKey) {
    if (!items[itemKey]) {
        addToBattleLog("Этот предмет больше не доступен!");
        return;
    }

    const item = items[itemKey];
    const finalPrice = getFinalPrice(itemKey);

    if (player.gold < finalPrice) {
        addToBattleLog(`Недостаточно золота! Нужно: ${finalPrice}`);
        return;
    }

    // Совершение покупки
    player.gold -= finalPrice;
    handleItemEffect(item);
    
    // Увеличение цены
    const oldPrice = currentPrices[itemKey].current;
    currentPrices[itemKey].current = calculateNewPrice(itemKey);
    
    // Обновление интерфейса
    updatePlayerInfo();
    updateShopPrices();
    showPriceChange(itemKey, oldPrice, currentPrices[itemKey].current);
    addToBattleLog(`${item.name} куплен за ${finalPrice} золота!`);

    // Специальные условия для артефактов
    if (item.type === 'artifact') {
        currentPrices[itemKey].current = 9999; // Делаем недоступным для повторной покупки
    }
}

function getFinalPrice(itemKey) {
    let price = currentPrices[itemKey].current;
    
    // Бафф на скидку
    if (player.buffs.some(b => b.type === 'discount')) {
        price *= 0.8;
    }
    
    return Math.floor(price);
}

function handleItemEffect(item) {
    switch(item.type) {
        case 'consumable':
            player.inventory.push(item);
            break;
            
        case 'equipment':
            equipItem(item);
            break;
            
        case 'artifact':
            applyArtifactEffect(item);
            break;
    }
}

function equipItem(item) {
    // Освобождаем слот экипировки
    if (player.equipment[item.slot]) {
        player.inventory.push(player.equipment[item.slot]);
    }
    
    player.equipment[item.slot] = item;
    updateEquipment();
    applyItemStats(item);
}

function applyArtifactEffect(item) {
    player.artifacts.push(item);
    item.effects.forEach(effect => {
        applyLongTermEffect(effect);
    });
}

function updateShopPrices() {
    document.querySelectorAll('.shop-item').forEach(element => {
        const itemKey = element.dataset.item;
        const priceElement = element.querySelector('.price');
        const item = items[itemKey];
        
        priceElement.textContent = currentPrices[itemKey].current;
        priceElement.classList.toggle('unavailable', currentPrices[itemKey].current > 9999);
        
        // Обновление описания
        element.querySelector('.description').textContent = 
            `${item.description} [Уровень: ${item.level || 1}]`;
    });
}

// Восстановление цен при перезагрузке
function restorePrices(savedPrices) {
    currentPrices = JSON.parse(JSON.stringify(savedPrices));
}

export { 
    buyItem, 
    currentPrices, 
    updateShopPrices, 
    restorePrices,
    getFinalPrice
};