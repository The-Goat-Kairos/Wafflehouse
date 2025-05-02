const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the wafflehouse.'),
	async execute(message, _) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild

        await message.reply(`Oh, honey, you know you can't leave this place. **Don't try that shit again.**`);
	},
};
