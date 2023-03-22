const {useQueue} = require ('discord-player');


module.exports = {
    name: 'skip',
    description: 'skip the currently playing song and play next song',
    voiceChannel: true,

    async execute(interaction) {
        try {

            const queue = useQueue(interaction.guild.id);

            if (!queue.isPlaying() || !queue) {
                return interaction.reply('No song is currently playing');
            }


            queue.node.skip();
            interaction.reply('Skipped the current song and played the next song');
        }
        catch (error) {
            console.error(error);
            interaction.reply('An error occurred while trying to skip the song');
        }
    }
}