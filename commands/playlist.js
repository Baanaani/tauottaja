const { QueryType, useMasterPlayer, useQueue } = require('discord-player')

module.exports = {
    name : 'playlist',
    description : 'Lisää soittolista!',
    voiceChannel : true,
    options : [
        {
            name : 'soittolista',
            description: 'Mistä tuodaan soittolista?',
            type : 3,
            required : true
        }
    ],

    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            const player = useMasterPlayer();
            const queue = useQueue(interaction.guild.id);
            const query = interaction.options.getString('soittolista', true);
            console.log(`Soittolista: **${query}**`)
            const results = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (!results.hasTracks()) { //Check if we found results for this query
                await interaction.reply(`We found no tracks for ${query}!`);
                return;
            }
            if (!queue || !queue.node.isPlaying()) {
                await interaction.reply({content: `Soittolistaa ladataan`, ephemeral: true});
                await player.play(channel, results, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username
                        },
                        bufferingTimeout: 5000,
                        leaveOnEnd: false,
                    }
                });
            }
            else {
                queue.addTrack(results.playlist ? results.tracks : results.tracks[0])
                //const tracks = queue.tracks.toArray();

            }
        } catch (error) {
            console.log(error)
        }
    }
}