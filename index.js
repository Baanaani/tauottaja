require('dotenv').config()

const {Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('node:fs');

const events = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
const commands = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
const logic = fs.readdirSync("./logic").filter((file) => file.endsWith(".js"));


const client = new Client({intents: [
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
    prefix: "#",
    playing: ";play (music)",
    lagMonitor: 1000,
    defaultVolume: 50,
    maxVolume: 100,
    autoLeave: true,
    displayVoiceState: true,
    leaveOnStop: false,
    leaveOnEmpty: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    // emitAddListWhenCreatingQueue: false,
};

player.config.ytdlOptions = {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25
}

commandsList = []
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
console.log(`Loading commands...`);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name && command.description) {
        commandsList.push(command)
        console.log(`=> [Loaded Command] -- ${command.name.toLowerCase()}`)
        client.commands.set(command.name.toLowerCase(), command)
        delete require.cache[require.resolve(`./commands/${file}`)];
    } else {
        console.log(`XX [Failed Command] -- ${file.split('.')[0].toLowerCase()}`)
    }
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

player.events.on('playerStart', (queue, track) => {
    if (queue.repeatMode !== 0) return;
    console.log(`Toistaa kappaletta: **${track.title}**`);
    queue.metadata.send(`🎶 | Nyt toistaa: **${track.title}**`);
    queue.metadata.send(`Kappaleen pituus: **${track.duration}**!`);
});
player.events.on('playerError', (queue, error) => {
    console.log(`I'm having trouble connecting => ${error.message}`);
});

player.events.on('error', (queue, error) => {
    console.log(`There was a problem with the song queue => ${error.message}`);
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

client.once("error", (message, error) => {
    console.error(`Error: ${error} ${message}`);
});

client.once(Events.ClientReady, c => {
    console.log(`✅ ${c.user.tag} is online`)
});


client.destroy();

client.login(process.env.DISCORD_TOKEN);