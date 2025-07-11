const {
    PermissionFlagsBits,
    InteractionContextType,
    SlashCommandBuilder,
    MessageFlags,
} = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName("addstreamer")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .setDescription("Add a streamer to the announcement list.")
        .addStringOption(option =>
            option
                .setName("streamer")
                .setDescription("The streamer to add")
                .setRequired(true)
        ),
    async execute(interaction) {
        const streamerName = interaction.options.getString("streamer");

        // Check if the streamer is already in the list
        if (interaction.client.streamers.includes(streamerName)) {
            return await interaction.reply({
                content: `Streamer "${streamerName}" is already in the list.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Add the streamer
        interaction.client.streamers.push(streamerName);

        await interaction.reply({
            content: `Streamer "${streamerName}" has been added to the list.`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
