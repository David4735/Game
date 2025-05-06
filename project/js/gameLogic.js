// js/gameLogic.js
import { 
    BALANCE,
    enemies,
    bosses,
    basePrices,
    itemUpgrades
} from './gameData.js';
import { 
    updatePlayerInfo, 
    updateEnemyHealth, 
    addToBattleLog,
    animateMiss,
    showPriceChange
} from './ui.js';
import { gatherMaterials } from './crafting.js';

// Инициализация усиленных монстров
const modifiedEnemies = enemies.map(monster => ({
    ...monster,
    currentHealth: Math.floor(monster.baseHealth * BALANCE.MONSTER_HEALTH_MULTI),
    currentAttack: monster.baseAttack * BALANCE.MONSTER_ATTACK_MULTI
}));

const modifiedBosses = bosses.map(boss => ({
    ...boss,
    currentHealth: Math.floor(boss.baseHealth * BALANCE.MONSTER_HEALTH_MULTI),
    currentAttack: boss.baseAttack * BALANCE.MONSTER_ATTACK_MULTI
}));

// Основная функция атаки
function attack() {
    // Проверка промаха
    if(isMiss()) {
        handleMiss();
        return;
    }

    // Расчет урона
    const damage = calculateDamage(player, enemy);
    applyDamage(enemy, damage);
    
    // Проверка смерти врага
    if(enemy.currentHealth <= 0) {
        handleEnemyDefeat();
        return;
    }

    // Контратака врага
    setTimeout(enemyAttack, 1000);
}

// Вспомогательные функции
function isMiss() {
    let missChance = BALANCE.MISS_CHANCE;
    
    // Бонусы экипировки
    if(player.equipment.artifact?.effects?.accuracy) {
        missChance -= player.equipment.artifact.effects.accuracy;
    }
    
    return Math.random() < missChance;
}

function calculateDamage(attacker, target) {
    let baseDamage = attacker.attack - Math.floor(target.defense / 2);
    
    // Критический удар
    const critChance = player.equipment.weapon?.critChance || 0.05;
    if(Math.random() < critChance) {
        baseDamage *= 2;
        addToBattleLog("Критический удар!");
    }
    
    return Math.max(1, baseDamage);
}

function handleMiss() {
    addToBattleLog("Вы промахнулись!");
    animateMiss();
    enemyAttack();
}

function applyDamage(target, damage) {
    target.currentHealth -= damage;
    addToBattleLog(`Нанесено ${damage} урона!`);
    updateEnemyHealth();
}

function enemyAttack() {
    const damage = calculateDamage(enemy, player);
    player.health = Math.max(0, player.health - damage);
    
    addToBattleLog(`${enemy.name} наносит вам ${damage} урона!`);
    updatePlayerHealth();
    
    if(player.health <= 0) handlePlayerDeath();
}

function handleEnemyDefeat() {
    addToBattleLog(`${enemy.name} побежден!`);
    
    // Награды
    player.gold += calculateReward(enemy);
    player.exp += enemy.exp;
    
    // Дроп ресурсов
    if(Math.random() < BALANCE.RESOURCE_DROP) {
        gatherMaterials();
    }
    
    // Обновление цен
    inflatePrices();
    generateNewEnemy();
}

function calculateReward(enemy) {
    let reward = enemy.gold;
    
    // Бонусы на золото
    if(player.equipment.artifact?.effects?.goldBonus) {
        reward *= 1 + player.equipment.artifact.effects.goldBonus;
    }
    
    return Math.floor(reward);
}

function inflatePrices() {
    Object.keys(basePrices).forEach(itemKey => {
        const newPrice = Math.min(
            basePrices[itemKey].max,
            Math.floor(basePrices[itemKey].current * BALANCE.PRICE_INFLATION)
        );
        
        if(newPrice !== basePrices[itemKey].current) {
            showPriceChange(itemKey, basePrices[itemKey].current, newPrice);
            basePrices[itemKey].current = newPrice;
        }
    });
}

function generateNewEnemy() {
    const isBoss = player.level % 5 === 0;
    const pool = isBoss ? modifiedBosses : modifiedEnemies;
    
    enemy = {
        ...pool[Math.floor(Math.random() * pool.length)],
        level: player.level
    };
    
    // Масштабирование характеристик
    enemy.currentHealth = Math.floor(enemy.currentHealth * (1 + player.level/20));
    enemy.currentAttack = Math.floor(enemy.currentAttack * (1 + player.level/25));
}

export { 
    modifiedEnemies as enemies, 
    modifiedBosses as bosses, 
    attack,
    generateNewEnemy
};