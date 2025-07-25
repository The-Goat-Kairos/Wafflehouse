const {Events, MessageFlags, EmbedBuilder} = require("discord.js");
const optionEvents = require("../handlers/optionEvents.js");
const db = require("../db.js");

const eventHandlers = {
    option: handleOptionEvent,
    battle: handleBattleEvent,
};

async function handleBattleEvent(interaction) {
    const action = interaction.customId.split(":")[1];
    const battleId = interaction.customId.split(":")[2]; // userId == battleId == interaction.customId.split()[2]
    const userId = battleId;

    if (!action || !battleId) return;

    if (interaction.user.id !== userId) {
        return interaction.reply({
            content: "You cannot interact with this button.",
            ephemeral: true,
        });
    }

    const activeBattles = interaction.client.activeBattleStates;
    const battle = activeBattles.get(battleId);

    if (!battle) {
        return interaction.reply({
            content: "This battle was not found.",
            ephemeral: true,
        });
    }

    battle.resetTimeout(interaction);

    let battleMessage;
    // Actions are fight, syrup, hashbrown, scream
    if (action === "fight") {
        battleMessage = battle.fight();
    } else if (action === "syrup") {
        battleMessage = battle.syrup();
    } else if (action === "hashbrown") {
        battleMessage = battle.hashbrown();
    } else if (action === "scream") {
        battleMessage = battle.scream();
    } else if (action === "special") {
        battleMessage = battle.special();
    } else {
        console.error(
            "Error: Can not find the correct button action in a battle event."
        );
        return;
    }
    const actionEmbed = new EmbedBuilder()
        .setDescription(battleMessage)
        .setColor(interaction.member.displayHexColor);

    const enemyTurnResult = battle.doEnemyTurn(); // Love me some good side-effects
    const enemyActionEmbed = new EmbedBuilder()
        .setDescription(enemyTurnResult)
        .setColor(interaction.member.displayHexColor);

    battle.endTurn(action);

    // Check if the battle is over and handle the end of the battle
    if (battle.isOver()) {
        const defeatMessages = [
            "You've managed to snatch defeat from the jaws of victory. Better luck next time...",
            "The enemy turned you into a side dish. A tragic fate...",
            "You've been out-cooked and your pay has been reduced for the week.",
            "The enemy simply walked up and smacked you around a little bit. Weakling.",
        ];

        const victoryMessages = [
            `Congratulations! You've flipped the tables and served that ${battle.enemy.name} a defeat! Waffles for everyone!`,
            `Victory! You've out-cooked the ${battle.enemy.name} and can proudly call yourself employee of the hour. Maybe.`,
            `Easy. The ${battle.enemy.name} never saw it coming!`,
            `Damn. annihilated 'em. Good job, man.`,
            `Victory is yours! ${battle.enemy.name} will remember this...`,
        ];

        const resultMessage =
            battle.playerHp <= 0
                ? defeatMessages[
                      Math.floor(Math.random() * defeatMessages.length)
                  ]
                : victoryMessages[
                      Math.floor(Math.random() * victoryMessages.length)
                  ];

        battle.stopTimeout();
        await interaction.reply({
            embeds: [actionEmbed],
            content: resultMessage,
        });
        activeBattles.delete(battleId);
    } else {
        // Reply with the action message, the enemy's action, updated battle embed, and buttons
        const battleEmbed = await battle.getBattleEmbed();
        const buttons = battle.getButtons();
        await interaction.reply({
            embeds: [actionEmbed, enemyActionEmbed, battleEmbed],
            components: [buttons],
        });
    }
}

async function handleOptionEvent(interaction) {
    const buttonId = interaction.customId.split(":")[1];
    const userId = interaction.customId.split(":")[2];

    if (!buttonId || !userId) return;

    if (interaction.user.id !== userId) {
        return interaction.reply({
            content: "You cannot interact with this button.",
            ephemeral: true,
        });
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
            // Get event type (option or battle)
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
