const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const botMentionRegex = new RegExp(`^<@!?${message.client.user.id}> `);
        if (!botMentionRegex.test(message.content)) return;

        // Get command name and arguments
        const args = message.content.split(/\s+/);
        const commandName = args[1]?.toLowerCase();

        // Remove the mention and get clean arguments
        const cleanArgs = args.slice(2);
        await message.reply(`Command: ${commandName},\nArguments: ${cleanArgs}`);
    }
}
