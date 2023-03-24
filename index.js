require('dotenv').config()
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
require('@discordjs/voice');
const fs = require('node:fs');

const client = new Client({ intents: [
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
    },
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
    queue.metadata.channel.send(`Biisiä ladataan`);
});

player.events.on('disconnect', (queue) => {
    // Emitted when the bot leaves the voice channel
    queue.metadata.channel.send('Looks like my job here is done, leaving now!');
});

player.events.on('playerStart', (queue, track) => {
    if (queue.repeatMode !== 0) return;
    console.log(`Toistaa kappaletta: **${track.title}**, jonka pituus on ${track.duration}`);
    queue.metadata.channel.send(`🎶 | Nyt toistaa: **${track.title}**`);
    queue.metadata.channel.send(`Kappaleen pituus: **${track.duration}**!`);
});

player.events.on('playerTrigger', (queue, track, reason) => {
    queue.metadata.channel.send(`Havaittu: ${reason}`);
});

player.events.on('emptyChannel', (queue) => {
    queue.node.stop();
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    queue.metadata.channel.send(`Leaving because no vc activity for the past 5 minutes`);
});

player.events.on('emptyQueue', (queue) => {
    // Emitted when the player queue has finished
    queue.metadata.channel.send('Queue finished!');
    queue.node.stop();
});

player.events.on('audioTrackAdd', (queue, track) => {
    // Emitted when the player adds a single song to its queue
    if (queue.node.isPlaying()){
        queue.metadata.channel.send(`Lisätty jonoon ${track.title}`)
    }
    else {
        queue.metadata.channel.send(`Track **${track.title}** queued`);
    }
});

player.events.on('audioTracksAdd', (queue, track) => {
    // Emitted when the player adds multiple songs to its queue
    if (queue.node.isPlaying()){
        queue.metadata.channel.send(`Soittolista on lisätty ${track.title}`)
    }
    else {
        queue.metadata.channel.send(`Aloitetaan soittolistan toisto kappaleesta: ${track.title}`);
    }
});

player.events.on('playerSkip', (queue, track) => {
    // Emitted when the audio player fails to load the stream for a song
    queue.metadata.channel.send(`Skipping **${track.title}** due to an issue!`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`I'm having trouble connecting => ${error.message}`);
    console.log(error);
});

player.events.on('error', (queue, error) => {
    console.log(`There was a problem with the song queue => ${error.message}`);
    console.log(error);
});

/*
player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});
 */

client.login(process.env.DISCORD_TOKEN);