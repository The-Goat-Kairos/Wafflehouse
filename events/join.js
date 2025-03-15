const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
        if (!channel) return;

        await channel.send(`Welcome to the server, ${member}!`);
    }
}
