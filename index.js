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
client.adminCommands = new Collection();
client.userCommands = new Collection();
client.welcomeChannel = "general";
client.activeBattleStates = new Map();
client.streamers = ["swiggitycat", "shadowolf015vt"];
client.botChannel = "general";
client.defaultColour = 0x99aab5;


// Load all slash/admin adminCommands
const adminCommandsPath = path.join(__dirname, 'admincommands'); // Get the AdminCommands Folder
const adminCommandFolders = fs.readdirSync(adminCommandsPath); // Get folders in AdminCommands Folder

for (const folder of adminCommandFolders) {
	const commandsPath = path.join(adminCommandsPath, folder); // Get the path of the folders in AdminCommands Folder
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get the JS files in the folders
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file); // Get the path of the JS files
		const command = require(filePath); // Import the command

		if ('data' in command && 'execute' in command) {
			client.adminCommands.set(command.data.name, command);
		} else {
			console.log(`[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}



// Load all user commands into client.userCommands
const userCommandsPath = path.join(__dirname, 'usercommands');
const userCommandFolders = fs.readdirSync(userCommandsPath);

for (const folder of userCommandFolders) {
	const commandsPath = path.join(userCommandsPath, folder); // Get the path of the folders in AdminCommands Folder
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get the JS files in the folders
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file); // Get the path of the JS files
		const command = require(filePath); // Import the command (try catch issue?)

		if ('data' in command && 'execute' in command) {
			client.userCommands.set(command.data.name, command);
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
