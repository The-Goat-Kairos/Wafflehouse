const { EmbedBuilder } = require('discord.js');
const standardEvents = require('./standardEvents.js');
const db = require('../db.js')

class MessageEvents {
    static async triggerRandomEvent(message) {
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
