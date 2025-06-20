const {Events, MessageFlags, EmbedBuilder} = require("discord.js");
const optionEvents = require("../handlers/optionEvents.js");
const db = require("../db.js");

const eventHandlers = {
    option: handleOptionEvent,
    battle: handleBattleEvent,
};

async function handleBattleEvent(interaction) {
    const _ = interaction.customId.split(":")[0]; // option or battle
    const action = interaction.customId.split(":")[1];
    const [userId, battleId] = [interaction.customId.split(":")[2]];

    if (!action || !userId || !battleId) return;

    if (interaction.user.id !== userId) {
        return interaction.reply({ content: "You cannot interact with this button.", ephemeral: true });
    }

    const activeBattles = interaction.client.activeBattleStates;
    const battle = activeBattles.get(battleId);

    if (!battle) {
        return interaction.reply("This battle wasn't found");
    }
    // Actions are fight, syrup, hashbrown, scream
    if (action === "fight") {
        battle.attack();
    } else if (action === "syrup") {
        battle.syrup();
    } else if (action === "hasbrown") {
        battle.hashbrown();
    } else if (action === "scream") {
        battle.scream();
    }
}

async function handleOptionEvent(interaction) {
    const _ = interaction.customId.split(":")[0]; // option or battle
    const buttonId = interaction.customId.split(":")[1];
    const userId = interaction.customId.split(":")[2];

    if (!buttonId || !userId) return;

    if (interaction.user.id !== userId) {
        return interaction.reply({ content: "You cannot interact with this button.", ephemeral: true });
    }

    optionEvents.forEach(event => {
        // Loop through all optionEvents to check for the right one
        event.options.forEach(option => {
            // Match the options of a optionEvent to the button name. If they match, do whatever
            if (buttonId === option.optionName) {
                const optionResult = option.getWeightedRandomValue();
                const gainMessage = `You ${optionResult >= 0 ? "gain" : "lose"} ${Math.abs(optionResult.gain)} credits.`;

                const optionEventEmbed = new EmbedBuilder()
                    .setTitle(`You ${option.optionName.toLowerCase()}.`)
                    .setDescription(
                        `${optionResult.message} \n\n ${gainMessage}` ||
                            "PANIC!!!! SOMETHING HAPPENED!!!!"
                    )
                    .setColor(0x0099ff);

                db.prepare(
                    "UPDATE players SET credits = ? WHERE user_id = ?"
                ).run(optionResult.gain, userId);

                interaction.reply({
                    embeds: [optionEventEmbed],
                });
            }
        });
    });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {
            // Is this a button press?
            const eventType = interaction.customId.split(":")[0];
            const handler = eventHandlers[eventType];

            if (handler) {
                await handler(interaction);
            } else {
                console.error(`No handler found for event type: ${eventType}`);
            }
        }

        if (interaction.isChatInputCommand()) {
            // Is this a normal slash command?
            const command = interaction.client.adminCommands.get(
                interaction.commandName
            );

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content:
                            "There was an error while executing this command!",
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content:
                            "There was an error while executing this command!",
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        }
    },
};
