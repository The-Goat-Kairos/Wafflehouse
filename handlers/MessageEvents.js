const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const standardEvents = require('./standardEvents.js');
const optionEvents = require('./optionEvents.js');
const db = require('../db.js')

class MessageEvents {
    static async triggerRandomEvent(message) {
        this.randomOptionEvent(message);

        return;
        let randomNum = Math.Floor(Math.random()*100) + 1;

        if (randomNum <= 50) {
            this.randomStandardEvent(message);
        } else if (randomNum <= 80) {
            this.randomOptionEvent(message);
        } else {
            this.randomBattleEvent(message);
        }
    }

    static async randomOptionEvent(message) {
        const randomEvent = optionEvents[Math.floor(Math.random() * optionEvents.length)];
        const actionRow = new ActionRowBuilder()

        randomEvent.options.forEach((option) => {
            const optionEventButton = new ButtonBuilder()
                .setCustomId(option.optionName)
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

        //console.log(`Event ${index + 1}: ${event.initialMessage}`);
        //console.log("Options:");

        //event.options.forEach((option, optionIndex) => {
        //    console.log(`  ${optionIndex + 1}. ${option.optionName}`);
        //    option.values.forEach((result, resultIndex) => {
        //        console.log(`     - Result ${resultIndex + 1}: ${result.message} (Gain: ${result.gain}, Weight: ${result.weight})`);
        //    });
        //});
    }

    static async randomBattleEvent(message) {

    }

    static async randomStandardEvent(message) {
        //for (let i = 0; i < standardEvents.length; i++) {
        //    console.log(`Message: \`${standardEvents[i].message}\`. Points: ${standardEvents[i].amount}.`);
        //}
        //console.log(standardEvents.length);
        const randomEvent = standardEvents[Math.floor(Math.random() * standardEvents.length)];
        db.prepare('UPDATE players SET credits = credits + ? WHERE user_id = ?').run(randomEvent.amount, message.author.id);

        const wonCredits = randomEvent.amount >= 0;
        const titleMessage = `${wonCredits ? "Congratulations" : "So sorry"}, ${message.author.globalName}${wonCredits ? "!" : "."}`;
        const pointsMessage = `You ${wonCredits ? "gain" : "lose"} ${Math.abs(randomEvent.amount)} credit${randomEvent.amount == 1 ? "" : "s"}.`;

        const embed = new EmbedBuilder()
        .setColor(message.member.displayHexColor)
        .setTitle(titleMessage)
        .setDescription(`${randomEvent.message}\n\n${pointsMessage}`)

        await message.reply({ embeds: [embed] });
    }

    // There will be 3 types of events:
    // - BattleEvent
    // - OptionEvent
    // - StandardEvent
}

module.exports = MessageEvents;
