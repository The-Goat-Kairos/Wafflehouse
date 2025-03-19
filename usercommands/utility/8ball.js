const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the magic 8ball a question'),
	async execute(message, _) {
        const responsesPath = path.join(__dirname, '8balloptions.txt'); // Get the AdminCommands Folder
        const responses = fs.readFileSync(responsesPath).toString().split("\n");

        let randomIndex = Math.floor(Math.random() * responses.length);
        await message.reply(`<@!${message.author.id}>, ${responses[randomIndex]}`);
	},
};
