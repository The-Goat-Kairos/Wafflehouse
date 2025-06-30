const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		"name": "coinflip",
		"description": "Flip a coin!"
    },
	async execute(message, _) {
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor || message.client.defaultColour)
            .setTitle(":coin: You flip a coin...")
            .setDescription(Math.random() < 0.5 ? "Heads!" : "Tails")

        await message.reply({ embeds: [embed] });
	},
};
