const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle')
		.setDescription('Disable or enable events for you'),
	async execute(interaction) {
        await interaction.reply(`[ERORR]: This command has not been implemented yet.`);
	},
};
