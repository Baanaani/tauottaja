const { QueryType, useMasterPlayer, useQueue } = require('discord-player')

    module.exports = {
    name: 'play',
    description: 'Play a song of your choice!',
    voiceChannel: true,
    options: [
        {
            name: 'biisi',
            description: 'Mitä soitetaan?',
            type: 3,
            required: true
        }
    ],

    async execute(interaction) {

        try {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            const player = useMasterPlayer();
            const queue = useQueue(interaction.guild.id);
            const query = interaction.options.getString('biisi', true);
            console.log(`biisi: **${query}**`)
            const result = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (!result.hasTracks()) { //Check if we found results for this query
                await interaction.reply(`We found no tracks for ${query}!`);
                return;
            }
            if (!queue || !queue.node.isPlaying()) {
                await interaction.reply({content: `Loading your track`, ephemeral: true});
                await player.play(channel, result, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username
                        },
                        bufferingTimeout: 5000,
                        leaveOnEnd: false,
                    }
                })
            } else {
                const index = queue.getSize();
                queue.addTrack(result.tracks[index])
                await interaction.reply({content: `Lisätään soittolistalle.`, ephemeral: true});
            }
        } catch (error) {
            console.log(error)
        }
    }
}

