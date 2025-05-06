// js/events.js
import { 
    addToBattleLog, 
    showEventPopup, 
    updateShopPrices 
} from './ui.js';
import { 
    gatherMaterials, 
    applyCraftingBuff 
} from './crafting.js';
import { 
    generateEnemy, 
    startMiniBossFight 
} from './gameLogic.js';
import { BALANCE } from './gameData.js';

const randomEvents = [
    // Базовые события
    {
        name: 'Ресурсный тайник',
        condition: () => Math.random() < 0.12,
        action: () => {
            addToBattleLog("Вы нашли тайник с ресурсами!");
            gatherMaterials();
            showEventPopup('treasure');
        }
    },
    {
        name: 'Нападение разбойников',
        condition: () => Math.random() < 0.07 && player.level > 3,
        action: () => {
            addToBattleLog("На вас напали разбойники!");
            startAmbushFight([
                generateEnemy('Бандит', 2),
                generateEnemy('Бандит', 2),
                generateEnemy('Главарь бандитов', 3)
            ]);
        }
    },
    
    // Новые события экономики
    {
        name: 'Экономический кризис',
        condition: () => Math.random() < 0.05,
        action: () => {
            BALANCE.PRICE_INFLATION *= 1.15;
            addToBattleLog("Инфляция резко выросла! Цены в магазине подскочили.");
            updateShopPrices();
            showEventPopup('economy-crisis');
        }
    },
    {
        name: 'Рынок покупателя',
        condition: () => Math.random() < 0.03,
        action: () => {
            BALANCE.PRICE_INFLATION /= 1.1;
            addToBattleLog("Цены временно снизились благодаря избытку товаров.");
            updateShopPrices();
            showEventPopup('market-sale');
        }
    },
    
    // События с монстрами
    {
        name: 'Ярость монстров',
        condition: () => Math.random() < 0.08 && player.level > 5,
        action: () => {
            addToBattleLog("Монстры стали вдвойне опасны!");
            currentEnemies.forEach(enemy => {
                enemy.attack *= 1.5;
                enemy.health *= 1.3;
            });
            showEventPopup('monster-rage');
        }
    },
    
    // События крафтинга
    {
        name: 'Вдохновение ремесленника',
        condition: () => Math.random() < 0.1 && craftingLevel > 3,
        action: () => {
            addToBattleLog("Ваши навыки крафтинга временно улучшены!");
            applyCraftingBuff({
                type: 'crafting_boost',
                duration: 30,
                effect: 0.25
            });
            showEventPopup('crafting-inspiration');
        }
    },
    
    // Квестовые события
    {
        name: 'Странный незнакомец',
        condition: () => Math.random() < 0.04,
        action: () => {
            showEventPopup('stranger', {
                title: "Таинственный незнакомец",
                message: "Он предлагает вам странную сделку...",
                options: [
                    { 
                        text: "Принять предложение", 
                        action: () => startSideQuest('stranger') 
                    },
                    { 
                        text: "Отказаться", 
                        action: () => addToBattleLog("Вы отказались от сделки") 
                    }
                ]
            });
        }
    }
];

// Система мини-боссов
const miniBossEvents = [
    {
        name: 'Драконьи следы',
        condition: () => player.kills > 50 && !bossesDefeated.dragon,
        action: () => {
            addToBattleLog("Вы обнаружили следы древнего дракона!");
            startMiniBossFight('Дракон');
        }
    }
];

// Обработка сложных событий
function startAmbushFight(enemies) {
    const originalEnemy = currentEnemy;
    currentEnemy = null;
    
    enemies.forEach((enemy, index) => {
        setTimeout(() => {
            currentEnemy = enemy;
            addToBattleLog(`Появился ${enemy.name} (Уровень ${enemy.level})!`);
            if(index === enemies.length - 1) {
                addToBattleLog("Это главарь банды!");
            }
        }, index * 3000);
    });
}

function handleEvent(event) {
    try {
        event.action();
        logEvent(event.name);
    } catch (error) {
        console.error('Ошибка в обработке события:', error);
    }
}

function checkRandomEvents() {
    // Проверка обычных событий
    randomEvents.forEach(event => {
        if(event.condition()) handleEvent(event);
    });
    
    // Проверка событий мини-боссов
    miniBossEvents.forEach(event => {
        if(event.condition()) handleEvent(event);
    });
    
    // Динамическая регулировка частоты событий
    adjustEventProbabilities();
}

// Дополнительные функции
function adjustEventProbabilities() {
    if(player.level > 10) {
        BALANCE.EVENT_CHANCE_MODIFIER *= 1.1;
    }
}

function logEvent(eventName) {
    if(!player.eventLog) player.eventLog = {};
    player.eventLog[eventName] = (player.eventLog[eventName] || 0) + 1;
}

export { 
    checkRandomEvents, 
    startAmbushFight, 
    handleEvent 
};