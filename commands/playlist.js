const { QueryType, useMasterPlayer, useQueue, Playlist } = require('discord-player')

module.exports = {
    name : 'playlist',
    description : 'lisää soittolista!',
    voiceChannel : true,
    options : [
        {
            name : 'soittolista',
            description: 'mistä tuodaan soittolista?',
            type : 3,
            required : true
        }
    ],

    async execute(interaction) {
    
        try {
            const player = useQueue();
            const query = interaction.options.getString('soittolista', true);
            console.log(`soittolista: **${query}**`)
            const results = await player.search(query);

            if (!results.hasTracks()) { //Check if we found results for this query
                await interaction.reply(`soittolistaa ${query} ei löydetty`);
                return;
            } else {
                await player.play(interaction.member.voice.channel, results, {
                    nodeOptions: {
                        metadata: interaction.channel,
                        //You can add more options over here
                    },
                });
            }

        }catch (error) { console.log(error) }
}};
