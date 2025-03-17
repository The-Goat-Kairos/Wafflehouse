const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings the user'),
	async execute(message, args) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild

        // Replied with "Pong!" and the delay between when the user sent the message and the time the response was sent
        await message.reply(`Pong! **${Date.now() - message.createdTimestamp}ms.**`);
	},
};
