const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		"name": "leave",
		"description": "Leave the wafflehouse"
    },
	async execute(message, _) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle("Leave...?")
            .setDescription(`Oh, honey, you know you can't leave this place.`)

        await message.reply({ embeds: [embed] });
	},
};
