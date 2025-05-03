const { EmbedBuilder } = require('discord.js');
const db = require('../../db.js');

module.exports = {
	data: {
		"name": "balance",
		"description": "Get your balance"
    },
	async execute(message, _) {
        const credits = db.prepare('SELECT credits FROM players WHERE user_id = ?').get(message.author.id);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${message.author.globalName}'s Balance`)
            .addFields({ name: 'Credits', value: `${credits.credits}`, inline: true })
            .setThumbnail(message.author.avatarURL())

        await message.reply({ embeds: [embed] });
    }
}
