const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		"name": "avatar",
		"description": "Get the avatar of a user"
    },
	async execute(message, args) {
		// message.author is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild

        let user;

        // If the userArgument is a mention, get the mentioned user
        if (message.mentions.users.size > 1) {
            user = message.mentions.users.at(1);
        } else if (args.length > 0) {
            const userArgument = args[0];
            // If it's not a mention, try to fetch the user by ID
            user = message.guild.members.cache.get(userArgument)?.user;
            if (!user) {
                await message.reply("I couldn't find that user, so here is your avatar! :smiley:");
                user = message.author;
            }
        } else {
            // If no user is specified, default to the message author
            user = message.author;
        }

        const embed = new EmbedBuilder()
            .setColor(hexToRgb(message.member.displayHexColor))
            .setTitle(`${user.globalName != null ? user.globalName : user.displayName}'s avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 })); // Set the avatar image

        await message.reply({ embeds: [embed] });
	},
};

function hexToRgb(hex) {
    // Remove the '#' character if it exists
    hex = hex.replace(/^#/, '');

    // Parse the hex string into red, green, and blue components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255; // Extract red
    const g = (bigint >> 8) & 255;  // Extract green
    const b = bigint & 255;         // Extract blue

    // Return the RGB tuple
    return [r, g, b];
}
