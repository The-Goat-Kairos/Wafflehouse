const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: {
		"name": "serverinfo",
		"description": "Some fun statistics about this server!"
    },
	async execute(message, _) {
		// message.user is the object representing the User who ran the command
		// message.member is the GuildMember object, which represents the user in the specific guild
        const server = message.guild;

        let owner = null;
        await message.client.users.fetch(server.ownerId)
            .then(user => {
                owner = user.globalName
            })
            .catch(error => {
                console.error(error);
            })

        const nsfwLevels = {
            0: "Default",
            1: "Explicit",
            2: "Safe",
            3: "Age-restricted"
        };
        const nsfwLevelString = nsfwLevels[server.nsfwLevel] || "Unknown";

        const premiumTiers = {
            0: "None",
            1: "Tier 1",
            2: "Tier 2",
            3: "Tier 3"
        };
        const premiumTierString = premiumTiers[server.premiumTier] || "None";

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Server Information")
            .setDescription(`${capitalizeFirstLetter(server.name)} was created at ${server.createdAt}. It has ${server.memberCount} members and is thus ${server.large ? "" : "not"} a large server. It is ${server.verified ? "" : "not"} verified.`)
            .addFields(
                { name: 'NSFW Level', value: nsfwLevelString, inline: true },
                { name: "Owner", value: owner || "There is no owner, somehow?", inline: true },
                { name: "Partnered", value: `${server.partnered ? "Partnered" : "Not partnered"}`, inline: true },
                { name: "Premium Tier", value: premiumTierString, inline: true },
                { name: "Number of boosts", value: server.premiumSubscriptionCount || '0', inline: true },
                { name: "Server Description", value: server.description || "There is no server description.", inline: false },
            )
            .setImage(server.iconURL())

        await message.reply({ embeds: [embed] });
	},
};

function capitalizeFirstLetter(word) {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);
}
