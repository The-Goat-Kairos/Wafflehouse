const {Events, ActivityType} = require("discord.js");
const MINUTE_IN_MILISECONDS = 10000;
const streamersAlreadyLive = new Map();

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity("best waffles!", {
            type: ActivityType.Competing,
        });
        setInterval(() => {
            monitorStream(client);
        }, MINUTE_IN_MILISECONDS);
    },
};

async function announceLive(streamer, client) {
    let channel = client.channels.cache.find(
        channel => channel.name === client.botChannel
    );
    if (channel) {
        channel.send(
            `${streamer} is now live! Check it out: https://www.twitch.tv/${streamer}`
        );
    } else {
        console.error("Error: Can't find channel");
    }
}

async function monitorStream(client) {
    for (let [streamer, _] of streamersAlreadyLive) {
        // For all streamers, if they're live and they weren't previously live, we announce them and also set them to being live
        if (await checkIfLive(streamer)) {
            if (!streamersAlreadyLive.get(streamer)) {
                streamersAlreadyLive.set(streamer, true);
                await announceLive(streamer, client);
            }
        } else {
            // If they aren't live but they were live before, we set their live status to false
            if (streamersAlreadyLive.get(streamer)) {
                streamersAlreadyLive.set(streamer, false);
            }
        }
    }
}

async function checkIfLive(username) {
    try {
        const response = await fetch(`https://twitch.tv/${username}`);
        const sourceCode = await response.text();

        return sourceCode.includes("isLiveBroadcast")
    } catch (error) {
        console.error(error);
    }
}
