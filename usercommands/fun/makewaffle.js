const { EmbedBuilder } = require('discord.js');
const db = require('../../db.js');

module.exports = {
	data: {
		"name": "makewaffle",
		"description": "Make a waffle"
    },
	async execute(message, _) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild
        const target = message.member;

        const amountOfCredits = Math.floor(Math.random() * 5);
        const credits = db
            .prepare("SELECT credits FROM players WHERE user_id = ?")
            .get(target.id);

        db.prepare('UPDATE players SET credits = ? WHERE user_id = ?').run(amountOfCredits + credits, target.id);
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor || message.client.defaultColour)
            .setTitle("Doing your job!!!!")
            .setDescription(`You made a waffle. Good job, man. I'll give you ${amountOfCredits} credits for that.`)

        await message.reply({ embeds: [embed] });
	},
};

