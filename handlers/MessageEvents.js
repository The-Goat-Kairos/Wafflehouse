const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const standardEvents = require("./standardEvents.js");
const optionEvents = require("./optionEvents.js");
const db = require("../db.js");
const {BattleState} = require("./BattleState.js");
const {Enemy} = require("./Enemy.js");

class MessageEvents {
    static async triggerRandomEvent(message) {
        this.randomBattleEvent(message);
        return;

        //let randomNum = Math.Floor(Math.random()*100) + 1;

        //if (randomNum <= 50) { // 50% chance
        //    this.randomStandardEvent(message);
        //} else if (randomNum <= 80) { // 30%
        //    this.randomOptionEvent(message);
        //} else { // 20%
        //    this.randomBattleEvent(message);
        //}
    }

    static async randomOptionEvent(message) {
        const randomEvent =
            optionEvents[Math.floor(Math.random() * optionEvents.length)];
        const actionRow = new ActionRowBuilder();

        randomEvent.options.forEach(option => {
            const optionEventButton = new ButtonBuilder()
                .setCustomId(`option:${option.optionName}:${message.member.id}`)
                .setLabel(option.optionName)
                .setStyle(ButtonStyle.Primary);

            actionRow.addComponents(optionEventButton);
        });

        const optionEventEmbed = new EmbedBuilder()
            .setTitle(randomEvent.initialMessage)
            .setDescription("What do you do?")
            .setColor(message.member.displayHexColor);

        await message.reply({
            embeds: [optionEventEmbed],
            components: [actionRow],
        });
    }

    static async randomBattleEvent(message) {
        const enemy = new Enemy("Raccoon", 30, ":raccoon:", 3);
        //const enemy = new Enemy("Raccoon", 30, ":raccoon:", "animal");
        const userId = message.member.id; // battleId=userId=message.member.id

        const activeBattles = message.client.activeBattleStates; // A map of all battles from userId to BattleState
        const battle = new BattleState(userId, enemy, message.guild);
        activeBattles.set(message.member.id, battle);

        const embed = await battle.getBattleEmbed();
        const buttons = battle.getButtons();

        battle.startTimeout(message);

        await message.reply({
            embeds: [embed],
            components: [buttons],
        });
    }

    static async randomStandardEvent(message) {
        //for (let i = 0; i < standardEvents.length; i++) {
        //    console.log(`Message: \`${standardEvents[i].message}\`. Points: ${standardEvents[i].amount}.`);
        //}
        //console.log(standardEvents.length);
        const randomEvent =
            standardEvents[Math.floor(Math.random() * standardEvents.length)];
        db.prepare(
            "UPDATE players SET credits = credits + ? WHERE user_id = ?"
        ).run(randomEvent.amount, message.author.id);

        const wonCredits = randomEvent.amount >= 0;
        const titleMessage = `${wonCredits ? "Congratulations" : "So sorry"}, ${message.author.globalName}${wonCredits ? "!" : "."}`;
        const pointsMessage = `You ${wonCredits ? "gain" : "lose"} ${Math.abs(randomEvent.amount)} credit${randomEvent.amount == 1 ? "" : "s"}.`;

        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle(titleMessage)
            .setDescription(`${randomEvent.message}\n\n${pointsMessage}`);

        await message.reply({embeds: [embed]});
    }

    // There will be 3 types of events:
    // - BattleEvent
    // - OptionEvent
    // - StandardEvent
}

module.exports = MessageEvents;
