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

        // Check if command in client.userCommands
        if (message.client.userCommands.has(commandName)) {
            const command = message.client.userCommands.get(commandName);

            try {
                await command.execute(message, ...cleanArgs);
            } catch (error) {
                console.error(error);
                await message.reply('There was an error trying to execute that command!');
            }
        }

        await message.reply(`Command: ${commandName},\nArguments: ${cleanArgs}`);
    }
}
