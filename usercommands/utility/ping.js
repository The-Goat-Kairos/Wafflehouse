const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: {
		"name": "ping",
		"description": "Ping the bot"
    },
	async execute(message, _) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild

        await message.reply(`Pong! **${Date.now() - message.createdTimestamp}ms.**`);
	},
};
