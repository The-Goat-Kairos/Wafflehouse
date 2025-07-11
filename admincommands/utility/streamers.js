const {
    InteractionContextType,
    SlashCommandBuilder,
    MessageFlags,
} = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName("liststreamers")
        .setContexts(InteractionContextType.Guild)
        .setDescription("List all streamers in the announcement list."),
    async execute(interaction) {
        // Check if there are any streamers in the list
        if (interaction.client.streamers.length === 0) {
            return await interaction.reply({
                content: "There are no streamers in the announcement list.",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Create a formatted list of streamers
        const streamerList = interaction.client.streamers.join(", ");

        await interaction.reply({
            content: `Current streamers in the announcement list: ${streamerList}.`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
