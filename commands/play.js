const { QueryType, useMasterPlayer, useQueue } = require('discord-player')

module.exports = {
    name : 'play',
    description : 'Play a song of your choice!',
    voiceChannel : true,
    options : [
        {
            name : 'biisi',
            description: 'Mitä soitetaan?',
            type : 3,
            required : true
        }
    ],

    async execute(interaction) {
        try {
            const player = useMasterPlayer();
            const query = interaction.options.getString('biisi', true);
            console.log(`biisi: **${query}**`)
            const results = await player.search(query);

            if (!results.hasTracks()) { //Check if we found results for this query
                await interaction.reply(`We found no tracks for ${query}!`);
                return;
            } else {
                await player.play(interaction.member.voice.channel, results, {
                    nodeOptions: {
                        metadata: interaction.channel,
                        //You can add more options over here
                    },
                });
            }
            await interaction.reply({content: `Loading your track(s)`});
        }
        /*
            const queue = useQueue(interaction.guild.id)

            //const searchResult = await player.search('biisi', {
            //    requestedBy: interaction.user,
            //    searchEngine: QueryType.AUTO
            //});
            await player.play(interaction.member.voice.channel, results);

            await interaction.deferReply()


            const embed = new EmbedBuilder()
            function yess() {
                const totalDurationMs = yes.track.playlist.tracks.reduce((a, c) => c.durationMS + a, 0)
                const totalDurationSec = Math.floor(totalDurationMs / 1000);
                const hours = Math.floor(totalDurationSec / 3600);
                const minutes = Math.floor((totalDurationSec % 3600) / 60);
                const seconds = totalDurationSec % 60;
                const durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                return durationStr
            }

            embed
                .setDescription(`${yes.track.playlist ? `**multiple tracks** from: **${yes.track.playlist.title}**` : `**${yes.track.title}**`}`)
                .setThumbnail(`${yes.track.playlist ? `${yes.track.playlist.thumbnail.url}` : `${yes.track.thumbnail}`}`)
                .setColor(`#00ff08`)
                .setTimestamp()
                .setFooter({ text: `Duration: ${yes.track.playlist ? `${yess()}` : `${yes.track.duration}`} | Event Loop Lag ${interaction.client.player.eventLoopLag.toFixed(0)}` })
            return interaction.editReply({ embeds: [embed ]})
            */
        catch (error) {
            console.log(error)
        }
    }
}
