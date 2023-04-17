require('dotenv').config()
const { Client, GatewayIntentBits, Collection,
        EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
        } = require('discord.js');
const { Player, useTimeline, useQueue} = require('discord-player');
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
    reconnectInterval: 30,
    reconnectTries: 2,
    restTimeout: 10000,
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

const buttonFiles = fs.readdirSync("./buttons").filter((file) => file.endsWith(".js"));
    for (const buttons of buttonFiles) {
        const button = require(`./buttons/${buttons}`);
        console.log(`=> [Loaded button] -- ${button.customId}`)
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
    queue.metadata.channel.send(`Biisiä ladataan.`);
});

player.events.on('disconnect', (queue) => {
    // Emitted when the bot leaves the voice channel
    queue.metadata.channel.send(' ❌ | Yhteys äänikanavalle on katkennut.');
});

player.events.on('playerStart', (queue, track) => {
    if (queue.repeatMode !== 0) return;
    const timeline = useTimeline(queue.metadata.guildId);
    const timestamp = useTimeline(queue.metadata.guildId);

    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId("back")   .setEmoji("⏮️") .setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("pause")  .setEmoji("⏸️") .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("resume") .setEmoji("▶️") .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("shuffle").setEmoji("🔁").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("skip")   .setEmoji("⏭️") .setStyle(ButtonStyle.Primary)
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId("mute")       .setEmoji("🔇").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("volume-down").setEmoji("🔉").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("volume-up")  .setEmoji("🔊").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("stop")       .setEmoji("⏹️") .setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("loop")       .setEmoji("⏹️") .setStyle(ButtonStyle.Danger)
        );

    console.log(`Toistaa kappaletta: **${track.author} - ${track.title}**, jonka pituus on ${track.duration}`);

    queue.metadata.channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Green")
                .setTitle("🎶 | Nyt toistaa: ")
                .setDescription(`**${track.author} - [${track.title}](${track.url})**`)
                .setThumbnail(track.thumbnail)
                .addFields([
                    {name: "Kesto", value: `${track?.duration ? track.duration : "N/A"}`, inline: true},
                    {name: '\u200B', value: '\u200B'},
                    {name: "Artisti", value: track.author, inline: true},
                    {name: "Linkki", value: `**[${track.title}](${track.url})**`, inline: false},
                ])
                .setTimestamp()
                .setFooter({
                    text: 'Some footer text here',
                    iconURL: 'https://i.imgur.com/AfFp7pu.png'
                })
        ],
        components: [row1, row2],
    })
});

player.events.on('playerTrigger', (queue, track, reason) => {
    console.log(`Havaittu soittimessa: ${reason}`);
    queue.metadata.channel.send(`Havaittu soittimessa: ${reason}`);
});

player.events.on('emptyChannel', (queue) => {
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    queue.metadata.channel.send( { embeds: [
                new EmbedBuilder()
                    .setDescription("🎶 | Kaikki jätti mut... :cry: \n En halua olla yksin, joten lähden viihteelle!")
                    .setColor("Yellow"),],
    });
});

player.events.on('emptyQueue', (queue) => {
    // Emitted when the player queue has finished
    queue.metadata.channel.send({
        embeds: [
            new EmbedBuilder()
                .setDescription("🎶 | Biisit loppuivat.")
                .setColor("Yellow"),
        ],
    });
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
    queue.metadata.channel.send(` :x: | Ongelmia jonossa olevan kappaleen kanssa => ${error.message}`);
    console.log(error);
});

player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});


client.login(process.env.DISCORD_TOKEN);