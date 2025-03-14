const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const botMention = message.content.match(/<@!?(\d+)>/);
        if (!botMention) return;

        // Get command name and arguments
        const args = message.content.split(/\s+/);
        const commandName = args[1]?.toLowerCase();

        // Remove the mention and get clean arguments
        const cleanArgs = args.slice(2);
        await message.reply(`Command: ${commandName},\n Arguments: ${cleanArgs}`);
    }
}
