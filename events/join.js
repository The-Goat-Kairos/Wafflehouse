const { Events } = require('discord.js');
const db = require('../db.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const user = db.prepare('SELECT * FROM players WHERE user_id = ?').get(target.id);

        if (!user && !target.bot) {
            db.prepare('INSERT INTO players (user_id) VALUES (?)').run(target.id);
        }

        const channel = member.guild.channels.cache.find(ch => ch.name === client.welcomeChannel);
        if (!channel) return;

        await channel.send(`Welcome to the server, ${member}!`);
    }
}
