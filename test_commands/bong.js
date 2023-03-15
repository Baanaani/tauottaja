const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bong')
        .setDescription('Replies with Pong!'),
    async execute(message) {
        await message.reply('Pong!')
    },
};


