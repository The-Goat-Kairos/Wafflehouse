const { EmbedBuilder } = require('discord.js');

const danceMessages = [
    "You did a little dance. Everyone cheered. :partying_face:",
    "You did a medium dance. Great job! :tada:",
    "You did a big dance. Standing ovation all around! :tada:",
    "You danced again! :tada:",
    "You danced again! :grinning:",
    "You danced again. :slight_smile:",
    "You danced again...",
    "You... danced again...",
    "It's good, it's good... It's just. It's getting a little old.",
    "You danced."
];

const danceCooldown = 20000; // 20 seconds
const userDanceStates = new Map();

module.exports = {
	data: {
		"name": "dance",
		"description": "Do a little dance!"
    },
	async execute(message, _) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild
        const now = Date.now();
        const id = message.author.id;
        if (!userDanceStates.has(id)) {
            userDanceStates.set(id, { index: 0, timeout: now });
        }

        let userState = userDanceStates.get(id);
        const lastTime = userState.timeout;

        console.log(`Now: ${now}, last time: ${lastTime}, Difference: ${Math.abs(now - lastTime)}, boolean: ${Math.abs(now - lastTime) >= danceCooldown}`);
        if (Math.abs(now - lastTime) >= danceCooldown) { // Check if its been danceCooldown miliseconds
            userDanceStates.set(id, { index: 0, timeout: now }); // Reset your stuff to basic
        }

        userState = userDanceStates.get(id);
        const currentIndex = userState.index;

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Dance")
            .setDescription(danceMessages[currentIndex])

        await message.reply({ embeds: [embed] });
        //await message.reply(danceMessages[currentIndex]); // Send the dance message

        userDanceStates.set(id, { index: currentIndex + 1, timeout: now } );

        if (userDanceStates.get(id).index >= danceMessages.length) {
            userDanceStates.set(id, { index: danceMessages.length - 1, timeout: lastTime });
        }

        // await message.reply(`Pong! **${Date.now() - message.createdTimestamp}ms.**`);
	},
};

