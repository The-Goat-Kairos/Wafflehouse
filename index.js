const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');


// Constants
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;


// Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();


// Load all commands
const foldersPath = path.join(__dirname, 'commands'); // Get the Commands Folder
const commandFolders = fs.readdirSync(foldersPath); // Get folders in Commands Folder

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder); // Get the path of the folders in Commands Folder
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get the JS files in the folders
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file); // Get the path of the JS files
		const command = require(filePath); // Import the command

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


// Load all events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}


// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
