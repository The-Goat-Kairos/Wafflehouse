const { Events } = require('discord.js');
const MessageEvents = require('../handlers/MessageEvents.js');

const userMessages = new Map(); // Map of users to their latest message time
const TIME_BEFORE_REMOVAL = 15000; // 15 seconds in milliseconds
const OPTIMAL_MESSAGE_RATE_SINGLE = 1500; // 1.5 seconds in milliseconds
const OPTIMAL_MESSAGE_RATE_MULTIPLE = 1000; // 1 second in milliseconds
const MESSAGE_AMOUNT = 3; // Default = 24
let messageCount = 0;

function shouldIncreaseMessageCount(difference, target) {
    const maxDistance = target;
    const distance = Math.abs(difference - target);

    const probability = Math.max(0, 1 - (distance / maxDistance));
    const randomValue = Math.random();

    if (randomValue < probability) {
        return true;
    }
    return false;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const botMentionRegex = new RegExp(`^<@!?${message.client.user.id}> `);
        if (!botMentionRegex.test(message.content)) { // If not mentioning this bot
            // Random Event Handling
            // Chance to trigger a random event
            const now = Date.now();
            const difference = now - userMessages.get(message.author.id); // Get the difference between now and their last message
            userMessages.set(message.author.id, Date.now()); // Set their new last message time
            const uniqueUsers = [...userMessages.keys()]; // Get the unique users.
            const recentUsers = uniqueUsers.filter(userId => (now - userMessages.get(userId)) <= TIME_BEFORE_REMOVAL); // Get the unique users who have said something in the last 15 seconds.

            if (recentUsers.length === 1) {
                if (shouldIncreaseMessageCount(difference, OPTIMAL_MESSAGE_RATE_SINGLE)) {
                    messageCount++;
                }
            } else if (recentUsers.length > 1) {
                if (shouldIncreaseMessageCount(difference, OPTIMAL_MESSAGE_RATE_MULTIPLE)) {
                    messageCount++;
                }
            }

            if (messageCount === MESSAGE_AMOUNT) {
                MessageEvents.triggerRandomEvent(message);
                messageCount = 0;
            }
            return;
        }

        // Common Command Handling
        // Get command name and arguments
        const args = message.content.split(/\s+/);
        const commandName = args[1]?.toLowerCase();

        // Remove the mention and get clean arguments
        const cleanArgs = args.slice(2) || [];

        // Check if command in client.userCommands
        if (message.client.userCommands.has(commandName)) {
            const command = message.client.userCommands.get(commandName);

            try {
                await command.execute(message, cleanArgs);
            } catch (error) {
                console.error(error);
                await message.reply('There was an error trying to execute that command!');
            }
        }
    }
}

