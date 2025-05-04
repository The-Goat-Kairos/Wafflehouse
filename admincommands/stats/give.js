const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../../db.js');

module.exports = {
    category: 'stats',
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give a user something.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('credits')
                .setDescription('Give a user credits.')
                .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of credits to give.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('item')
                .setDescription('Give a user an item.')
                .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('The item to give.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of items to give.')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');
        const item = interaction.options.getString('item');

        if (subcommand === 'credits') {
            if (target.bot) {
                await interaction.reply({
                    content: 'You cannot give credits to a bot.',
                    flags: MessageFlags.Ephemeral}
                );
                return;
            }

            const user = db.prepare('SELECT * FROM players WHERE user_id = ?').get(target.id);

            if (!user) {
                db.prepare('INSERT INTO players (user_id) VALUES (?)').run(target.id);
            }

            db.prepare('UPDATE players SET credits = credits + ? WHERE user_id = ?').run(amount, target.id);
            await interaction.reply({
                content: `Gave ${amount} credits to ${target.tag}.`,
                flags: MessageFlags.Ephemeral}
            );
        } else if (subcommand === 'item') {
            if (target.bot) {
                await interaction.reply({
                    content: 'You cannot give items to a bot.',
                    flags: MessageFlags.Ephemeral}
                );
                return;
            }

            const user = db.prepare('SELECT * FROM players WHERE user_id = ?').get(target.id);

            if (!user) {
                db.prepare('INSERT INTO players (user_id) VALUES (?)').run(target.id);
            }

            const inventory = JSON.parse(user.inventory);
            const itemIndex = inventory.findIndex(i => i.name === item);
            if (itemIndex === -1) {
                inventory.push({ name: item, amount });
            } else {
                inventory[itemIndex].amount += amount;
            }

            db.prepare('UPDATE players SET inventory = ? WHERE user_id = ?').run(JSON.stringify(inventory), target.id);
            await interaction.reply({
                content: `Gave ${amount} ${item}(s) to ${target.tag}.`,
                flags: MessageFlags.Ephemeral}
            );
        }
    }
};
