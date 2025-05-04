const { EmbedBuilder } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: {
		"name": "8ball",
		"description": "Ask the magic 8ball a question!"
    },
	async execute(message, _) {
        const responsesPath = path.join(__dirname, '8balloptions.txt'); // Get the 8balloptions file
        const responses = fs.readFileSync(responsesPath).toString().split("\n");

        let randomIndex = Math.floor(Math.random() * responses.length);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(":8ball: The magic eight-ball says...")
            .setDescription(responses[randomIndex])

        await message.reply({ embeds: [embed] });
	},
};
