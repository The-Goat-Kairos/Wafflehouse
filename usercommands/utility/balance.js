const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Get your balance.'),
	async execute(message, _) {
        const credits = db.prepare('SELECT credits FROM players WHERE user_id = ?').get(message.author.id);

        await message.reply(`You, ${message.author.globalName}, have ${credits.credits} credits.`)
    }
}
