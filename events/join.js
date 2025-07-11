const { Events } = require('discord.js');
const db = require('../db.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const user = db.prepare('SELECT * FROM players WHERE user_id = ?').get(member.id);

        if (!user && !membememberr.bot) {
            db.prepare('INSERT INTO players (user_id) VALUES (?)').run(member.id);
        }

        const channel = member.guild.channels.cache.find(ch => ch.name === member.client.welcomeChannel);
        if (!channel) return;

        await channel.send(`Welcome to your first day at the waffle house, ${member}! Your first shift starts tomorrow!`);
    }
}
