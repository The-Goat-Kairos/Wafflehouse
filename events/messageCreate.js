const { EmbedBuilder, Events } = require('discord.js');
const db = require('../db.js');

const userMessages = new Map(); // Map of users to their latest message time
const TIMEBEFOREREMOVAL = 15000; // 15 seconds in milliseconds
const OPTIMALMESSAGERATESINGLE = 1500; // 1.5 seconds in milliseconds
const OPTIMALMESSAGERATEMULTIPLE = 1000; // 1 second in milliseconds
let messageCount = 0;

function shouldIncreaseMessageCount(difference, target) {
    const maxDistance = target;
    const distance = Math.abs(difference - target);

    const probability = Math.max(0, 1 - (distance / maxDistance));
    const randomValue = Math.random();

    if (randomValue < probability) {
        return true;
    }
    return false;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;


        const botMentionRegex = new RegExp(`^<@!?${message.client.user.id}> `);
        if (!botMentionRegex.test(message.content)) { // If not mentioning this bot
            // Random Event Handling
            // Chance to trigger a random event
            const now = Date.now();
            const difference = now - userMessages.get(message.author.id); // Get the difference between now and their last message
            userMessages.set(message.author.id, Date.now()); // Set their new last message time
            const uniqueUsers = [...userMessages.keys()]; // Get the unique users.
            const recentUsers = uniqueUsers.filter(userId => (now - userMessages.get(userId)) <= TIMEBEFOREREMOVAL); // Get the unique users who have said something in the last 15 seconds.

            if (recentUsers.length === 1) {
                if (shouldIncreaseMessageCount(difference, OPTIMALMESSAGERATESINGLE)) {
                    messageCount++;
                }
            } else if (recentUsers.length > 1) {
                if (shouldIncreaseMessageCount(difference, OPTIMALMESSAGERATEMULTIPLE)) {
                    messageCount++;
                }
            }

            if (messageCount === 24) {
                randomMessageEvent(message);
                messageCount = 0;
            }
            return;
        }

        // Common Command Handling
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
    }
}

async function randomMessageEvent(message) {
    //for (let i = 0; i < events.length; i++) {
    //    console.log(`Message: \`${events[i].message}\`. Points: ${events[i].amount}.`);
    //}
    //console.log(events.length);
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    db.prepare('UPDATE players SET credits = credits + ? WHERE user_id = ?').run(randomEvent.amount, message.author.id);

    const wonCredits = randomEvent.amount >= 0;
    const titleMessage = `${wonCredits ? "Congratulations" : "So sorry"}, ${message.author.globalName}${wonCredits ? "!" : "."}`;
    const pointsMessage = `You ${wonCredits ? "gain" : "lose"} ${Math.abs(randomEvent.amount)} credit${randomEvent.amount == 1 ? "" : "s"}.`;

    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(titleMessage)
        .setDescription(`${randomEvent.message}\n\n${pointsMessage}`)

    await message.reply({ embeds: [embed] });
    //await message.reply(randomEvent.message);
}

const events = [
    {
        message: "Yippee! You found a hidden stash of waffles!",
        amount: 7,
    },
    {
        message: "You steal a pen.",
        amount: 1,
    },
    {
        message: "Apparently Ragnarok happened while you were sleeping and this waffle house is the only thing remaining standing in the whole universe.",
        amount: 5,
    },
    {
        message: "You forgot to lock the store after your closing shift. Nothing happened, though.",
        amount: 0,
    },
    {
        message: "The CEO brought you back a stick and 2 leafs. How kind.",
        amount: 2,
    },
    {
        message: "The CEO ate your lunch.",
        amount: -1,
    },
    {
        message: "The manager ate your lunch.",
        amount: -1,
    },
    {
        message: "Swig ate your lunch.",
        amount: -1,
    },
    {
        message: "The chef gave you an extra waffle for your trip home.",
        amount: 1,
    },
    {
        message: "You found asbestos in the ceiling tiles.",
        amount: -2,
    },
    {
        message: "You stop and wonder at how many paranormal things happen at this waffle house. Then you find an extra 2 credits in your pocket out of nowhere. How quaint.",
        amount: 2,
    },
    {
        message: "You turned away for 5 seconds and when you looked back, your coworker had purple eyes and slightly floating in the air. You smacked them and they returned to normal.",
        amount: 4,
    },
    {
        message: "A portal opened on the kitchen floor along with clouds of miasma and crackling lightning. You proceded to drop in a waffle and the portal closed.",
        amount: 0,
    },
    {
        message: "Aliens. Again.",
        amount: 0,
    },
    {
        message: "A great necromancer accidentally opened a portal in the kitchen, leading to him looking confused and mumbling something about wrong coordinates...",
        amount: -1,
    },
    {
        message: "Zeus tried to flirt with you, leading Hera to strike you down where you stood.",
        amount: -10,
    },
    {
        message: "A powerful extraterrestrial god complimented your services and now the Waffle House is a frequent meeting place for cultists.",
        amount: 3,
    },
    {
        message: "A wizard offers to teach you magic after you brought a very good waffle. Unfortunately, you thought you heard 'panic' and ran away in fear. Again.",
        amount: -3,
    },
    {
        message: "A demon opened up a waffle stand next to the waffle house for a day before the paladins found and killed him. Its waffles were good though.",
        amount: 0,
    },
    {
        message: "The writer got very bored and decided to give you 5 credits. Good luck with those.",
        amount: 5,
    },
    {
        message: "You insult a wizards robe and he traps you in his obelisk for an hour.",
        amount: -1,
    },
    {
        message: "A mighty sorcerer is unhappy with your service and casts 'Ten-Thousand Year Mind Prison!'",
        amount: -5,
    },
    {
        message: "You serve a powerful-looking wizard a waffle. He proceeds to leave the building, summon his 2023 Honda Accord LX (US) and leave.",
        amount: 0,
    },
    {
        message: "A stray cat stole a waffle. You would be sad, but they were very cute.",
        amount: 0,
    },
    {
        message: "You start to make a waffle and the pour the batter in the waffle iron. While it feels like an eternity, only three minutes have passed. Just before the existential dread creeps in, the waffle iron beeps and you move on with your day.",
        amount: 2,
    },
    {
        message: "You look outside for a moment, and see two extremely burly man trying to beat the shit out of each other. It seems Kazuya and Heihachi Mishima have shown up for their monthly throwdown. You wearily go pick up the broom and dustpan.",
        amount: 0,
    },
    {
        message: "A customer walks in, asking where the goth girls are. With the tiredness of a million fast food walkers, you tell them Goth IHOP is three blocks down, and this is a Waffle House.",
        amount: -2,
    },
    {
        message: "A group of rough looking bikers enter the waffle house, each one more intimidating than the last. They all order the silly clown face waffles from the kids menu, eat quickly and then leave a very generous tip of five cigarettes.",
        amount: 4,
    },
    {
        message: `It's 2 AM and a random man walks into the waffle house. He approaches you and asks "Hey, what do you guys make here?". Upon hearing "waffles", the man's brain chemistry completely changes, his mind gets thoroughly blown and he walks out a new man.`,
        amount: 10,
    },
    {
        message: "A family of four walks into the waffle house but before they can sit down a portal to an alternate dimension opens up and they fall through. Just a regular day at the waffle house",
        amount: 5,
    },
    {
        message: "You accidentally spilled syrup everywhere.",
        amount: -3,
    },
    {
        message: "You helped a customer and they tipped you generously!",
        amount: 10,
    },
    {
        message: "A waffle thief tried to steal your waffles, but you scared them off!",
        amount: 5,
    },
    {
        message: "You dropped a waffle on the floor. Don't waste food...",
        amount: -2,
    },
    {
        message: "You discovered a secret recipe!",
        amount: 7,
    },
    {
        message: "A customer left a bad review about you.",
        amount: -10,
    },
    {
        message: "You found a coupon for free waffles!",
        amount: 4,
    },
    {
        message: "You accidentally made too many waffles. What a waste!",
        amount: -3,
    },
    {
        message: "You made a perfect waffle! Everyone loves it!",
        amount: 12,
    },
    {
        message: "You got distracted and burned a waffle.",
        amount: -4,
    },
    {
        message: "A regular customer just ordered a special!",
        amount: 8,
    },
    {
        message: "You found a lost waffle! It’s still good!",
        amount: 3,
    },
    {
        message: "You found a lost waffle! It’s gone bad...",
        amount: -3,
    },
    {
        message: "You had a great day at the Waffle House! Everyone is happy!",
        amount: 7,
    },
    {
        message: "You accidentally mixed up the orders. Oops!",
        amount: -6,
    },
    {
        message: "You received a compliment from a customer! Keep it up!",
        amount: 4,
    },
    {
        message: "The manager asked if you have even showered. Yikes!",
        amount: 0,
    },
    {
        message: "You parked in a handicap spot and the police towed your car.",
        amount: -30,
    },
    {
        message: "You kind of made a fool of yourself in front of a customer...",
        amount: 0,
    },
    {
        message: "A customer complimented the decor of the waffle house. How nice.",
        amount: 0,
    },
    {
        message: "A customer didn't leave a tip.",
        amount: 0,
    },
    {
        message: "You found a stray fork. You put it back.",
        amount: 0,
    },
    {
        message: "You rolled a nat 1 on your charisma check after a customer asked for napkins and asked if they wanted a crusty sock.",
        amount: -4,
    },
    {
        message: "You overheard swig say streams are cancelled. Tragic.",
        amount: -1,
    },
    {
        message: "You overheard swig say streams are cancelled. Oh well.",
        amount: 0,
    },
    {
        message: "You overheard swig say streams are cancelled. Hurrah!",
        amount: 1,
    },
    {
        message: "You catch a glimpse of a cat lounging on a windowsill.",
        amount: 0,
    },
    {
        message: "The transdimensional portal to X̵̡͈̗͊ļ̵̥̻͙͚̞̜̙͍̟̈́̃͗́͑̅̑̅̀̎̊͠ͅo̶͎̯̭̩͂̈́ŗ̷̩̖̱̻͕̥̩͎̫̯̮̉̔͜t̶̨̠̲̞͚̘͍̟͍͇͆̓͂͒̐̄̕͜͝ḩ̸̛͓̲̣̬̮͙̈́͑͐̓͌̐́̒͒͐̉̐͌͘ĕ̴̢͙͔̤̳͍̞͉̹́͊̑̏͑̔p̴̨̫̘̝̄̐̉̓̓̐̎̾̊̂̅̀͗̓͜ burst open, unleashing a horde of evil demons. Second time. This week.",
        amount: -3,
    },
    {
        message: "The CEO caught you making magical circles in the bathrooms again.",
        amount: -5,
    },
    {
        message: "You catch Swig watching a Jake Gyllenhaal movie.",
        amount: 15,
    },
    {
        message: "You catch Pogr hating on Swig. All is right in the world.",
        amount: 1,
    },
    {
        message: "The deep fryers caught on fire because of you.",
        amount: -1,
    },
    {
        message: "You tried to clean the windows but accidentally threw the contents of the bucket all over your feet.",
        amount: 0,
    },
    {
        message: "You get a pay raise! Just kidding.",
        amount: 0,
    },
    {
        message: "You fell down a ladder.",
        amount: -1,
    },
    {
        message: "An extradimensional being offered you a deal. You declined and he proceded to take 1 credit.",
        amount: -1,
    },
    {
        message: "Everything feels normal. Nice.",
        amount: 0,
    },
    {
        message: "There's a fight outside. You are filled with determination.",
        amount: 5,
    },
    {
        message: "Karen.",
        amount: -2,
    },
    {
        message: "The mad clown puppet from Lies of P showed up to the waffle house. You sigh and type '!skill+'.",
        amount: 0,
    },
    {
        message: `A customer leaned back and sighed, "I love the smell of waffles in the morning..." It warms your heart but nothing else happens.`,
        amount: 0,
    },
];
