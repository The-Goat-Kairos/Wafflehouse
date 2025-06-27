class Enemy {
    constructor(name, hp, icon, attackStat) {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.icon = icon;
        this.battle = null;

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
        const damage = Math.floor(Math.random() * attackStat) + 1;
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
}

module.exports = {Enemy};
