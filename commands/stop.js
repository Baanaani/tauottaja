const { useQueue } = require('discord-player');

module.exports = {
    name: 'stop',
    description: 'Stop the currently playing song',
    voiceChannel: true,

    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            const queue = useQueue(interaction.guild.id);

            if (!queue.isPlaying()||!queue) {
                return interaction.reply('No song is currently playing');
            }
            queue.node.stop();
            interaction.reply('The song has been stopped');

        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while trying to stop the song');
        }
    }
}