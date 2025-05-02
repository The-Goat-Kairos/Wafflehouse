const db = require('../../db.js');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true)),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        const target = interaction.options.getUser('target');

        if (target.bot) {
            return interaction.reply({ content: 'You cannot select a bot!', ephemeral: true });
        }

        const credits = db.prepare('SELECT credits FROM players WHERE user_id = ?').get(target.id);
        await interaction.reply({
                content: `User ${target.globalName} has ${credits.credits} credits.`,
                flags: MessageFlags.Ephemeral
                });
        //
        //      await interaction.reply({
        //          content: 'You cannot give credits to a bot.',
        //          flags: MessageFlags.Ephemeral}
        //      );
	},
};
