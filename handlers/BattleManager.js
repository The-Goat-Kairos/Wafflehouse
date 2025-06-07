const { EmbedBuilder } = require('discord.js');

class BattleState {
    constructor(userId, enemy, guild) {
        this.guild = guild;
        this.userId = userId;
        this.enemy = enemy;
        this.playerHp = 20;
        this.turn = 1;
    }

    isOver() {
        return this.enemy.hp <= 0 || this.playerHp <= 0;
    }

    async getEmbed() {
        const member = await this.guild.members.fetch(this.userId);
        const embed = new EmbedBuilder()
            .setTitle(`:crossed_swords: A wild ${this.enemy.name} appears`)
            .setDescription(`It snarls at you over the waffle counter.\n\n**What do you do?**`)
            .setColor(member.displayHexColor)
            .addFields([
                {name: "Your HP", value: `${this.playerHp}`, inline: true},
                {name: `${this.enemy.icon} ${this.enemy.name}'s HP`, value: `${this.enemy.hp}`, inline: true},
            ]);
        return embed;
    }
}

module.exports = {
    BattleState
}
