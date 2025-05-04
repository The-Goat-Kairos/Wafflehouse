const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../../db.js');

module.exports = {
    category: 'stats',
    data: new SlashCommandBuilder()
        .setName('setcredits')
        .setDescription('Set the credits of a user.')
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of credits to set.')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        if (target.bot) {
            await interaction.reply({
                content: 'You cannot set the credits of a bot.',
                flags: MessageFlags.Ephemeral}
            );
            return;
        }

        db.prepare('UPDATE players SET credits = ? WHERE user_id = ?').run(amount, target.id);
        await interaction.reply({
            content: `Set the credits of ${target.tag} to ${amount}.`,
            flags: MessageFlags.Ephemeral}
        );
    }
}
