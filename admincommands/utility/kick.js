const {
    SlashCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
    MessageFlags,
} = require("discord.js");

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName("kick")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDescription("Kick a user from the server")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to kick")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the kick")
                .setRequired(false)
        ),

    async execute(interaction) {
        const targetUser = interaction.options.getUser("user");
        const reason =
            interaction.options.getString("reason") || "No reason provided";
        const member = await interaction.guild.members
            .fetch(targetUser.id)
            .catch(() => null);

        // Check if user exists in guild
        if (!member) {
            return interaction.reply({
                content: "That user is not in this server!",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Prevent kicking self
        if (member.id === interaction.user.id) {
            return interaction.reply({
                content: "You cannot kick yourself!",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Prevent kicking bot
        if (member.id === interaction.client.user.id) {
            return interaction.reply({
                content: "I cannot kick myself!",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Check role hierarchy
        if (
            member.roles.highest.position >=
            interaction.member.roles.highest.position
        ) {
            return interaction.reply({
                content:
                    "You cannot kick someone with equal or higher role position!",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Check if bot has permission to kick
        if (
            !interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.KickMembers
            )
        ) {
            return interaction.reply({
                content: "I lack permission to kick members!",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Check if target is kickable
        if (!member.kickable) {
            return interaction.reply({
                content:
                    "I cannot kick this user! They may have higher permissions.",
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            await member.kick(reason);

            // Send success message
            await interaction.reply({
                content: `Successfully kicked ${targetUser.tag} for: ${reason}`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error("[Error]: Kick error:", error);
            await interaction.reply({
                content: "An error occurred while trying to kick the user!",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
