const db = require('../../db.js');
const { InteractionContextType, SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    category: 'stats',
	data: new SlashCommandBuilder()
		.setName('user')
    	.setContexts(InteractionContextType.Guild)
		.setDescription('Provides information about the user.')
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true)),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        const target = interaction.options.getUser('target');

        if (target.bot) {
            return interaction.reply({ content: 'You cannot select a bot!', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(target.id).catch(_ => {
            return interaction.reply({ content: "You cannot get information from someone not in the server", ephemeral: true });
        });

        // target has type User
        // member has type GuildMember

        const credits = db.prepare('SELECT credits FROM players WHERE user_id = ?').get(target.id);
        await interaction.reply({
            content: `User: ${target.globalName} (username: ${target.username})\nID: ${target.id}\nColor: ${member.displayHexColor}\nJoined at: ${member.joinedAt}\nCreated at: ${target.createdAt}\nCredits: ${credits.credits}`,
                flags: MessageFlags.Ephemeral
                });
        //
        //      await interaction.reply({
        //          content: 'You cannot give credits to a bot.',
        //          flags: MessageFlags.Ephemeral}
        //      );
	},
};
