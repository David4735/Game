// js/init.js
import { 
    initUI, 
    loadGameState, 
    saveGameState 
} from './ui.js';
import { 
    initCrafting, 
    loadCraftingProgress 
} from './crafting.js';
import { 
    checkRandomEvents, 
    initEventSystem 
} from './events.js';
import { 
    initShop, 
    restorePrices 
} from './shop.js';
import { 
    generateNewEnemy, 
    initBattleSystem 
} from './gameLogic.js';

// Основная инициализация
function initializeGame() {
    try {
        // Загрузка сохраненного прогресса
        const savedData = loadGameState();
        
        // Инициализация систем
        initUI();
        initCrafting();
        initShop();
        initEventSystem();
        initBattleSystem();
        
        // Восстановление состояния
        if(savedData) {
            restorePrices(savedData.prices);
            loadCraftingProgress(savedData.crafting);
            generateNewEnemy(savedData.player.level);
        } else {
            generateNewEnemy(1);
        }
        
        // Настройка автосохранения
        setInterval(saveGameState, 30000);
        
        // Запуск игрового цикла
        startGameLoop();
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showErrorScreen();
    }
}

// Игровой цикл
function startGameLoop() {
    let lastTick = Date.now();
    
    const gameLoop = () => {
        const now = Date.now();
        const delta = now - lastTick;
        
        // Обновление систем
        updateDynamicPrices(delta);
        updateEnemyBehavior(delta);
        updateCraftingBuffs(delta);
        
        lastTick = now;
        requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
}

// Обработчики событий
function setupGlobalListeners() {
    // Автосохранение при закрытии
    window.addEventListener('beforeunload', saveGameState);
    
    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') showPauseMenu();
    });
}

// Запуск игры
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupGlobalListeners();
    
    // Настройка периодических проверок
    setInterval(() => {
        checkRandomEvents();
        checkAchievements();
        checkSpecialOffers();
    }, 60000);
});

export { initializeGame };