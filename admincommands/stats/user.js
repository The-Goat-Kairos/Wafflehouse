const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        //
        // Reply with "Ping!" and the delay between when the command was sent and the response time
        await interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms`);
	},
};
