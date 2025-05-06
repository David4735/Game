// js/gameData.js
// Базовые параметры баланса
const BALANCE = {
    MISS_CHANCE: 0.15,          // 15% шанс промаха
    PRICE_INFLATION: 1.07,      // 7% рост цен
    RESOURCE_DROP: 0.4,         // 40% шанс дропа ресурсов
    MONSTER_HEALTH_MULTI: 1.5,  // +50% к здоровью
    MONSTER_ATTACK_MULTI: 3,    // +200% к атаке
    CRAFT_FAIL_RETURN: 0.3      // 30% возврата материалов
};

// Модифицированные характеристики монстров
const enemyTemplate = [
    { 
        name: "Гоблин",
        baseHealth: 30,
        baseAttack: 5,
        baseDefense: 2,
        baseGold: 10,
        baseExp: 20,
        spawnChance: 0.4
    },
    { 
        name: "Скелет",
        baseHealth: 25,
        baseAttack: 7,
        baseDefense: 3,
        baseGold: 15,
        baseExp: 25,
        spawnChance: 0.3
    },
    { 
        name: "Мутировавший волк",
        baseHealth: 45,
        baseAttack: 9,
        baseDefense: 4,
        baseGold: 20,
        baseExp: 35,
        spawnChance: 0.2
    }
];

// Усиленные монстры
const enemies = enemyTemplate.map(monster => ({
    ...monster,
    baseHealth: Math.floor(monster.baseHealth * BALANCE.MONSTER_HEALTH_MULTI),
    baseAttack: monster.baseAttack * BALANCE.MONSTER_ATTACK_MULTI
}));

const bosses = [
    {
        name: "Король Гоблинов",
        baseHealth: Math.floor(150 * BALANCE.MONSTER_HEALTH_MULTI),
        baseAttack: 20 * BALANCE.MONSTER_ATTACK_MULTI,
        baseDefense: 15,
        baseGold: 200,
        baseExp: 500,
        specialAbility: "Призыв мобов"
    },
    {
        name: "Древний Дракон",
        baseHealth: Math.floor(300 * BALANCE.MONSTER_HEALTH_MULTI),
        baseAttack: 35 * BALANCE.MONSTER_ATTACK_MULTI,
        baseDefense: 25,
        baseGold: 500,
        baseExp: 1000,
        specialAbility: "Огненное дыхание"
    }
];

// Система крафтинга
const craftingRecipes = [
    {
        item: "Зелье здоровья",
        type: "consumable",
        ingredients: [
            { name: "Лечебные травы", quantity: 3 },
            { name: "Кристалл воды", quantity: 1 }
        ],
        chance: 0.7,
        buff: {
            effect: "heal",
            value: 30
        }
    },
    {
        item: "Эликсир ярости",
        type: "buff",
        ingredients: [
            { name: "Коготь дракона", quantity: 2 },
            { name: "Огненный кристалл", quantity: 1 }
        ],
        chance: 0.5,
        buff: {
            effect: "attack_boost",
            value: 15,
            duration: 3
        }
    }
];

// Ресурсы и их характеристики
const resources = [
    { 
        name: "Лечебные травы",
        dropChance: 0.5,
        locations: ["forest", "mountain"],
        rarity: "common"
    },
    { 
        name: "Кристалл воды",
        dropChance: 0.3,
        locations: ["river", "lake"],
        rarity: "uncommon"
    },
    { 
        name: "Коготь дракона",
        dropChance: 0.1,
        locations: ["dragon_lair"],
        rarity: "epic"
    }
];

// Базовые цены с системой инфляции
const basePrices = {
    potion: {
        base: 20,
        current: 20,
        max: 100
    },
    strength_potion: {
        base: 30,
        current: 30,
        max: 150
    },
    dragon_armor: {
        base: 500,
        current: 500,
        max: 2000
    }
};

// Система улучшения предметов
const itemUpgrades = {
    "Меч воина": {
        levels: {
            1: { attack: 5, requiredMaterials: [{ name: "Железо", quantity: 3 }] },
            2: { attack: 8, requiredMaterials: [{ name: "Сталь", quantity: 5 }] },
            3: { attack: 12, requiredMaterials: [{ name: "Мифрил", quantity: 3 }] }
        }
    }
};

export { 
    BALANCE,
    enemies, 
    bosses, 
    craftingRecipes, 
    resources, 
    basePrices,
    itemUpgrades
};