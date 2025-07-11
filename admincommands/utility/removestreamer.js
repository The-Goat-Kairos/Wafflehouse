const {
    PermissionFlagsBits,
    InteractionContextType,
    SlashCommandBuilder,
    MessageFlags,
} = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName("removestreamer")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .setDescription("Remove a streamer from the announcement list.")
        .addStringOption(option =>
            option
                .setName("streamer")
                .setDescription("The streamer to remove")
                .setRequired(true)
        ),
    async execute(interaction) {
        const streamerName = interaction.options.getString("streamer");

        // Check if the streamer is in the list
        if (!interaction.client.streamers.includes(streamerName)) {
            return await interaction.reply({
                content: `Streamer "${streamerName}" is not in the list.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Remove the streamer
        interaction.client.streamers = interaction.client.streamers.filter(
            s => s !== streamerName
        );

        await interaction.reply({
            content: `Streamer "${streamerName}" has been removed from the list.`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
