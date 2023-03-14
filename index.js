require('dotenv').config()
//console.log(process.env)
//const { generateDependencyReport } = require('@discordjs/voice');
//console.log(generateDependencyReport());
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('node:fs');

//const timestamp = queue.node.getTimestamp();
//const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

//const logic = fs.readdirSync("./logic").filter((file) => file.endsWith(".js"));


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent],
    presence: {
        status: 'online',
        activities: [{
            name: 'Tauottaja',
        }]
    }
});

const player = Player.singleton(client);

player.config = {
    prefix: "-",
    playing: ";play (music)",
    lagMonitor: 1000,
    defaultVolume: 50,
    maxVolume: 100,
    autoLeave: true,
    displayVoiceState: true,
    leaveOnStop: false,
    leaveOnEmpty: false,
    emitNewSongOnly: true,
};

player.config.ytdlOptions = {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25
}

client.commands = new Collection();
console.log(`Loading commands...`);
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
   console.log(`=> [Loaded Command] -- ${command.name.toLowerCase()}`)
    client.commands.set(command.name.toLowerCase(), command);
}

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        console.log(`=> [Loaded event] -- ${event.name}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }

player.events.on("connection", (queue) =>{
    console.log('Yhteys soittimeen löydetty');
    queue.metadata.send(`Biisiä ladataan`);
});

player.events.on('disconnect', (queue) => {
    // Emitted when the bot leaves the voice channel
    queue.metadata.send('Looks like my job here is done, leaving now!');
});

player.events.on('playerStart', (queue, track) => {
    if (queue.repeatMode !== 0) return;
    console.log(`Toistaa kappaletta: **${track.title}**, jonka pituus on ${track.duration}`);
    queue.metadata.send(`🎶 | Nyt toistaa: **${track.title}**`);
    queue.metadata.send(`Kappaleen pituus: **${track.duration}**!`);
});

player.events.on('emptyChannel', (queue) => {
    queue.node.stop();
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    queue.metadata.send(`Leaving because no vc activity for the past 5 minutes`);
});

player.events.on('emptyQueue', (queue) => {
    // Emitted when the player queue has finished
    queue.metadata.send('Queue finished!');
    queue.node.stop();
});

/*
player.events.on('audioTrackAdd', (queue, track) => {
    if (queue.isPlaying())
    // Emitted when the player adds a single song to its queue
    queue.metadata.send(`Track **${track.title}** queued`);
});

player.events.on('audioTracksAdd', (queue, track) => {
    // Emitted when the player adds multiple songs to its queue
    queue.metadata.send(`Multiple Track's queued`);
});

player.events.on('playerSkip', (queue, track) => {
    // Emitted when the audio player fails to load the stream for a song
    queue.metadata.send(`Skipping **${track.title}** due to an issue!`);
});
 */

player.events.on('playerError', (queue, error) => {
    console.log(`I'm having trouble connecting => ${error.message}`);
    console.log(error);
});

player.events.on('error', (queue, error) => {
    console.log(`There was a problem with the song queue => ${error.message}`);
    console.log(error);
});

player.on('debug', async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
});

player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});

client.destroy();

client.login(process.env.DISCORD_TOKEN);

/*
client.on('messageCreate', message => {
    if (message.author.bot || !message.guild) return;
    const prefix = "?"
    const args = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.shift().toLowerCase() === "play") {
        player.play(message.member?.voice?.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        })
    }
});
*/