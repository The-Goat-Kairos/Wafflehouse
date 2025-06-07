const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const standardEvents = require('./standardEvents.js');
const optionEvents = require('./optionEvents.js');
const db = require('../db.js')
const { BattleState, activeBattles } = require("./BattleManager.js");

class MessageEvents {
    static async triggerRandomEvent(message) {
        //this.randomOptionEvent(message);
        //return;

        let randomNum = Math.Floor(Math.random()*100) + 1;

        if (randomNum <= 50) { // 50% chance
            this.randomStandardEvent(message);
        } else if (randomNum <= 80) { // 30%
            this.randomOptionEvent(message);
        } else { // 20%
            this.randomBattleEvent(message);
        }
    }

    static async randomOptionEvent(message) {
        const randomEvent = optionEvents[Math.floor(Math.random() * optionEvents.length)];
        const actionRow = new ActionRowBuilder()

        randomEvent.options.forEach((option) => {
            const optionEventButton = new ButtonBuilder()
                .setCustomId(option.optionName + ":" + message.member.id)
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
        const enemy = {
            name: "Raccoon",
            hp: 30,
            icon: ":raccoon:"
        }

        const battle = new BattleState(message.member.id, enemy);
        activeBattles.set(message.member.id, battle);

        const embed = new EmbedBuilder()
            .setTitle(`:crossed_swords: A wild ${enemy.name} appears`)
            .setDescription(`It snarls at you over the waffle counter.\n\n**What do you do?**`)
            .setColor(message.member.displayHexColor)
            .addFields([
                {name: "Your HP", value: `${battle.playerHp}`, inline: true},
                {name: `${enemy.name}'s HP`, value: `${battle.enemyHp}`, inline: true},
            ]);

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`fight:${battle.userId}`).setLabel("Fight").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`syrup:${battle.userId}`).setLabel("Use Syrup").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`hashbrown:${battle.userId}`).setLabel("Throw Hashbrown").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`scream:${battle.userId}`).setLabel("Scream").setStyle(ButtonStyle.Secondary),
        );

        await message.reply({
            embeds: [embed],
            components: [buttons]
        });
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
