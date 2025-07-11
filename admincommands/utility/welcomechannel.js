const {
    PermissionFlagsBits,
    InteractionContextType,
    SlashCommandBuilder,
    MessageFlags,
} = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName("welcomechannel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .setDescription("Sets the channels the incoming user announcements are")
        .addStringOption(option =>
            option.setName("channel").setDescription("The channel name")
        ),
    async execute(interaction) {
        const channelName = interaction.options.getString("channelName");

        const channel = interaction.guild.channels.cache.find(
            c => c.name === channelName
        );

        if (!channel) {
            return await interaction.reply({
                content: `Channel "${channelName}" does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        interaction.client.welcomeChannel = "general";


        await interaction.reply({
            content: `Set the welcoming channel to ${channelName}.`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
