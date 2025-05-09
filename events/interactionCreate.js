const { Events, MessageFlags } = require('discord.js');
const optionEvents = require('../handlers/optionEvents.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (interaction.isButton()) { // Is this a button press?
            const buttonId = interaction.customId;
            if (!buttonId) return;

            optionEvents.forEach((event) => {
                event.options.forEach((option) => {
                    if (buttonId === option.optionName) {
                        const optionResult = option.getWeightedRandomValue();
                        interaction.reply(optionResult.message || "PANIC SOMETHING HAPPENED!!!!");
                    }
                });
            });
        }

		if (interaction.isChatInputCommand()) { // Is this a normal slash command?
            const command = interaction.client.adminCommands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        }
    },
};
