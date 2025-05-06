// js/init.js
import { initUI } from './ui.js';
import { initCrafting } from './crafting.js';
import { generateNewEnemy } from './gameLogic.js';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация интерфейса
    initUI();
    
    // Генерация первого врага
    generateNewEnemy();
    
    // Обработчик создания персонажа
    document.getElementById('create-character').addEventListener('click', () => {
        document.getElementById('character-creation').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
    });
});