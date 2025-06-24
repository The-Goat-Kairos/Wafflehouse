const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

class BattleState {
    constructor(userId, enemy, guild) {
        this.guild = guild;
        this.userId = userId;
        this.battleId = userId;
        this.enemy = enemy;
        this.playerHp = 20;
        this.maxPlayerHp = 20;
        this.turn = 1;
        this.specialMoveCooldown = 3;
    }

    isOver() {
        return this.enemy.hp <= 0 || this.playerHp <= 0;
    }

    async getBattleEmbed() {
        const member = await this.guild.members.fetch(this.userId);
        const embed = new EmbedBuilder()
            .setTitle(`:crossed_swords: A wild ${this.enemy.name} appears`)
            .setDescription(
                `It snarls at you over the waffle counter.\n\n**What do you do?**`
            )
            .setColor(member.displayHexColor)
            .addFields([
                {name: "Your HP", value: `${this.playerHp}`, inline: true},
                {
                    name: `${this.enemy.icon} ${this.enemy.name}'s HP`,
                    value: `${this.enemy.hp}`,
                    inline: true,
                },
                {name: "Turn", value: `${this.turn}`, inline: true},
                {
                    name: "Special Move Cooldown",
                    value: `${this.specialMoveCooldown}`,
                    inline: true,
                },
            ]);
        return embed;
    }

    getButtons() {
        // buttonId: 'battle:fight:userId:battleId=userId'
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`battle:fight:${this.battleId}`)
                .setLabel("Fight")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`battle:syrup:${this.battleId}`)
                .setLabel("Use Syrup")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`battle:hashbrown:${this.battleId}`)
                .setLabel("Throw Hashbrown")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`battle:scream:${this.battleId}`)
                .setLabel("Scream")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`battle:special:${this.battleId}`)
                .setLabel("Special Attack")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.specialMoveCooldown > 0)
        );
    }

    fight() {
        const damage = Math.floor(Math.random() * 6) + 1; // Random damage between 1 and 6
        this.enemy.hp -= damage;
        return `You attack the ${this.enemy.name} for ${damage} damage!`;
    }

    syrup() {
        const heal = Math.floor(Math.random() * 4) + 1; // Random heal between 1 and 4
        this.playerHp += heal;
        if (this.playerHp > this.maxPlayerHp) this.playerHp = this.maxPlayerHp;
        return `You pour syrup on yourself and heal for ${heal} HP!`;
    }

    hashbrown() {
        const hitChance = Math.random();
        if (hitChance < 0.7) {
            // 70% chance to hit
            const damage = Math.floor(Math.random() * 5) + 3; // Random damage between 3 and 7
            this.enemy.hp -= damage;
            return `You throw a hashbrown at the ${this.enemy.name} for ${damage} damage!`;
        } else {
            return `You missed the ${this.enemy.name} with the hashbrown!`;
        }
    }

    scream() {
        const scareChance = Math.random();
        if (scareChance < 0.5) {
            // 50% chance to scare
            this.enemy.hp -= 2; // Scaring does a small amount of damage
            return `You scream loudly, scaring the ${this.enemy.name} for 2 damage!`;
        } else {
            return `Your scream has no effect on the ${this.enemy.name}.`;
        }
    }

    special() {
        if (this.specialMoveCooldown > 0) {
            return `You can't use your special move yet! ${this.specialMoveCooldown} turns remaining.`;
        }
        const specialDamage = Math.floor(Math.random() * 10) + 5; // Random special damage between 5 and 15
        this.enemy.hp -= specialDamage;
        this.specialMoveCooldown = 3; // Set cooldown for 3 turns
        return `You unleash a special move on the ${this.enemy.name} for ${specialDamage} damage!`;
    }

    endTurn(action) {
        this.turn++;
        // Action makes sure the last move wasn't a special attack.
        if (this.specialMoveCooldown > 0 && action !== "special") {
            this.specialMoveCooldown--;
        }
    }
}

module.exports = {
    BattleState,
};
