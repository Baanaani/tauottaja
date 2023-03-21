const {useQueue, useHistory} = require ('discord-player');

module.exports = {
    name: 'previous',
    description: 'skip the currently playing song and play the previous song',
    voiceChannel: true,

    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            const queue = useQueue(interaction.guild.id);
            const history = useHistory(interaction.guild.id);
            const lastSong = queue.history.previousTrack;

            if (!queue ) {
                return interaction.reply('There is no previous song');
            }

            await history.previous();
            interaction.reply({ content: `Edellinen kappale oli:, [${lastSong.title}] `});
        }
        catch (error) {
            console.error(error);
            interaction.reply('An error occurred while trying to play the previous song');
        }
    }
};
