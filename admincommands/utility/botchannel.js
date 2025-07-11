const {
    PermissionFlagsBits,
    InteractionContextType,
    SlashCommandBuilder,
    MessageFlags,
} = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName("setchannel")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .setDescription("Set the channel the bot uses.")
        .addStringOption(option =>
            option.setName("channel").setDescription("The channel name")
        ),
    async execute(interaction) {
        const channelName = interaction.options.getString("channelName");

        const channel = interaction.guild.channels.cache.find(c => c.name === channelName);

        if (!channel) {
            return await interaction.reply({
                content: `Channel "${channelName}" does not exist.`,
                flags: MessageFlags.Ephemeral
            });

        }

        interaction.client.botchannelName = channelName;

        await interaction.reply({
            content: `Set the channel to ${channelName}.`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
