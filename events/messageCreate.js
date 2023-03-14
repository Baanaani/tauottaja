const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,

    async execute(message)  {
        console.log(`${message.author.username} : ${message.content}`);
        if (message.author.bot || message.channel.type === 'dm') return;
        const prefix = '/';
        if(!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (!args[0]) return message.channel.send('Unohdit lisämääreen komennosta');

        try {
            await command.execute(message);
        } catch (error) {
            console.log(`Error executing ${message}`)
            console.log(error)
        }
    }
}

/*
        if (!message.member.voice.channel)
            return message.channel.send(`Et ole äänikanavalla`);
        if (message.guild.members.me.voice.channel && message.member.voice.channelId !== message.guild.members.me.voice.channelId)
            return message.channel.send(`Et ole Botin äänikanavalla`);
        if (command) {
            console.log(`${message.author.username} : ${message.content}`);
            command.execute(client, message, command);
        }
 */