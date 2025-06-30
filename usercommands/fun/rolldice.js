const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		"name": "roll",
		"description": "Roll a dice!"
    },
	async execute(message, arguments) {
        let amount = parseInt(arguments[0]);
		if (isNaN(amount) || amount <= 0) amount = 6; // Default to 6 if not a valid number

		const rollResult = Math.ceil(Math.random() * amount);

        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor || message.client.defaultColour)
            .setTitle(`:game_die: You roll a ${amount}-sided die...`)
            .setDescription(`${rollResult}!`)

        await message.reply({ embeds: [embed] });
	},
};
