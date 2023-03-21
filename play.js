const { QueryType, useMasterPlayer, useQueue } = require('discord-player')

module.exports = {
    name : 'play',
    description : 'soittaa valitun biisin!',
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
                await interaction.reply(`biisiä ${query}! ei löytynyt`);
                return;
            } else {
                await player.play(interaction.member.voice.channel, results, {
                    nodeOptions: {
                        metadata: interaction.channel,
                        //You can add more options over here
                    },
                });
            }
            if (!client.player.playing) await client.player.play();
            const tracks = interaction.options.getInteger("value")
            const queue = interaction.client.player.nodes.get(interaction.guild)
            queue.addTrack(results.playlist ? results.tracks : results.tracks[0])
            
        }catch (error) { console.log(error) }
}};
