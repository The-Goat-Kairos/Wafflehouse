class Enemy {
    constructor(name, icon, description, hp, attackStat) {
        this.name = name;
        this.maxHp = hp;
        this.battle = null;

        this.icon = icon;
        this.description = description;

        this.hp = hp;
        this.attackStat = attackStat;
        this.defenseHealth = 0;

        this.HEAL_CONSTANT = 3;
        this.DEFENSE_CONSTANT = 5;
    }

    setBattle(battle) {
        this.battle = battle;
    }

    doTurn() {
        const option = Math.random();
        if (option < 0.5) return this.attack();
        if (option < 0.85) return this.heal();
        return this.defend();
    }

    attack() {
        const damage = Math.floor(Math.random() * this.attackStat) + 1;
        this.playerHp -= damage;
        return `${this.icon} ${this.name} attacks you for ${damage} damage!`;
    }

    heal() {
        const healAmount = Math.floor(Math.random() * this.HEAL_CONSTANT) + 1;
        this.hp += healAmount;
        this.hp = Math.min(this.hp, this.maxHp);
        return `${this.icon} ${this.name} heals itself for ${healAmount} HP!`;
    }

    defend() {
        this.defenseHealth = 5;
        return `${this.icon} ${this.name} braces itself, gaining ${this.DEFENSE_CONSTANT} defence!`;
    }

    damage(damageAmount) {
        let damageLeft = damageAmount;

        // First, apply damage to defenseHealth
        while (this.defenseHealth > 0 && damageLeft > 0) {
            this.defenseHealth -= 1;
            damageLeft -= 1;
        }

        // Then, apply any remaining damage to hp
        while (this.hp > 0 && damageLeft > 0) {
            this.hp -= 1;
            damageLeft -= 1;
        }

        // Ensure hp does not go below zero
        this.hp = Math.max(this.hp, 0);
    }

    static getRandomEnemy() {
        //constructor(name, icon, description, hp, attackStat) {
        const enemies = [
            new Enemy(
                "Raccoon",
                ":raccoon:",
                "It snarls at you from across the counter!",
                30,
                3
            ),
            new Enemy(
                "Angry Customer",
                ":angry:",
                "They shout about their order and demands a refund!",
                25,
                4
            ),
            new Enemy(
                "Greasy Chef",
                ":cook:",
                "He throws a spatula at you from the kitchen in frustration!",
                20,
                5
            ),
            new Enemy(
                "Waffle Monster",
                ":waffle:",
                "It oozes syrup... from across the counter?",
                10,
                6
            ),
            new Enemy(
                "Panda",
                ":panda_face:",
                "It lazily rolls towards you, knocking over tables and customers.",
                60,
                1
            ),
            new Enemy(
                "Eldritch Monster",
                ":ghost:",
                "It whispers incomprehensible horrors from across the counter!",
                99999,
                99999
            ),
            new Enemy(
                "Local Wizard",
                ":ghost:",
                "He begins casting a malicious spell at you from across the counter!",
                30,
                4
            ),
            new Enemy(
                "Stray Cat",
                ":ghost:",
                "It hisses at you from across the counter!",
                15,
                5
            ),
        ];

        const randomIndex = Math.floor(Math.random() * enemies.length);
        return enemies[randomIndex];
    }

    static getRandomPrefix() {
        const prefixes = [
            "A wild",
            "A wild",
            "A wild",
            "A rabid",
            "A wise",
            "A pissed off",
            "An angry",
            "A creepy",
            "A magical",
            "A demonic",
            "A very sexy",
            "A sad",
            "A mystical",
            "A scrawny",
            "A wandering",
            "A brawny",
            "A pink",
            "A basic",
        ];

        const randomIndex = Math.floor(Math.random() * prefixes.length);
        return prefixes[randomIndex];
    }
}

module.exports = {Enemy};
