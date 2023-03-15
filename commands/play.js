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

        await message.followUp({
                content: `⏱ | Loading your ${res.playlist ? 'playlist' : 'track'}...`,
            });
            await res.playlist ? client.player.addTrack(res.tracks) : client.player.addTrack(res.tracks[0]);
            if (!client.player.playing) await client.player.play();
        }catch (error) {
            console.log(error);
            await message.followUp({
                content: 'There was an error trying to execute that command: ' + error.message,
            });
                    try {

        const tracks = interaction.options.getInteger("value")
        const queue = interaction.client.player.nodes.get(interaction.guild)

        if (!queue) {
            return interaction.reply({ content: "There is no queue!" })

        }

        const trackIndex = tracks - 1;

        await queue.node.jump(trackIndex)

        return interaction.reply({ content: "Jumped successfully successfully!" })
    }catch (error) {
        console.log(error)
    }

    try {

        const tracks = interaction.options.getInteger("value")
        const queue = interaction.client.player.nodes.get(interaction.guild)

        if (!queue) {
            return interaction.reply({ content: "There is no queue!" })
        }

        const trackIndex = tracks - 1;

        await queue.node.jump(trackIndex)

        return interaction.reply({ content: "Jumped successfully!" })
    }catch (error) { console.log(error) }
}}};
