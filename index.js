require('dotenv').config()
//console.log(process.env)
//const { generateDependencyReport } = require('@discordjs/voice');
//console.log(generateDependencyReport());
const {Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { Player, useQueue } = require('discord-player');
const fs = require('node:fs');

const events = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
const commands = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
const logic = fs.readdirSync("./logic").filter((file) => file.endsWith(".js"));
const stop = require('./stop.js');

const client = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent] });

const player = new Player(client);
client.commands = new Collection();

player.config = {
    leaveOnStop: false,
    leaveOnEmpty: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    // emitAddListWhenCreatingQueue: false,
};

//const queue = client.player.nodes.get(process.env.GUILD_ID);

client.once("error", (message, error) => {
    console.error(`Error: ${error} ${message}`);
});

client.once(Events.ClientReady, c => {
    console.log(`✅ ${c.user.tag} is online`)
});

client.on(Events.MessageCreate, message => {
    if (message.author.bot || !message.guild) return;
    const prefix = "%"
    const args = message.content.slice(prefix.length).trim().split(/ +/g)

    if (args.shift().toLowerCase() === "play") {
        player.play(message.member?.voice?.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        })
    }

    if (message.content.toLowerCase() === prefix + "pause") {
        player.pause(message);
        message.reply("Musiikin toisto tauolla.");
    }
});

player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
//    queue.metadata.channel.send(`Started playing **${track.title}**!`);
//    queue.metadata.channel.send(`Started playing **${track.duration}**!`);
});

client.destroy();

client.login(process.env.DISCORD_TOKEN);