const { InteractionContextType, SlashCommandBuilder } = require('discord.js');
const db = require('../../db.js');

module.exports = {
    category: 'stats',
	data: new SlashCommandBuilder()
		.setName('toggle')
    	.setContexts(InteractionContextType.Guild)
		.setDescription('Disable or enable events for you'),
	async execute(interaction) {
        var user = db.prepare('SELECT disabled FROM players WHERE user_id = ?').get(interaction.user.id);

        if (!user) {
            db.prepare('INSERT INTO players (user_id) VALUES (?)').run(interaction.user.id);
            user = { disabled: 0} // We can set user.disabled to be 0 as we just created the user
        }

        if (user.disabled == 0) {
            user.disabled = 1;
        } else {
            user.disabled = 0;
        }
        db.prepare('UPDATE players SET disabled = ? WHERE user_id = ?').run(user.disabled, interaction.user.id);

        await interaction.reply(`${user.disabled ? "Disabled" : "Enabled"} random encounters for you.`);
	},
};
