const { QueryType, useMasterPlayer, useQueue } = require('discord-player')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

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
                return interaction.reply({embeds: [embed]})
            }

            await interaction.deferReply()
            await interaction.editReply({ content: `Loading a: ${result.playlist ? 'playlist' : 'track' }`})
            
            if (!queue || !queue.node.isPlaying()) {
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

                const embed = new EmbedBuilder()
                embed
                .setTitle(`biisi:`)
                .setColor(`#00ff08`)
                .setTimestamp()

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('1')
                    .setLabel('pause/resume')
                    .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                    .setCustomId('2')
                    .setLabel('skip')
                    .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                    .setCustomId('3')
                    .setLabel('stop')
                    .setStyle(ButtonStyle.Danger)
                );
                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [row]})
            } else {
                const index = queue.getSize();
                queue.addTrack(result.tracks[index])
                console.log("track added")
            }
        } catch (error) {
            console.log(error)
        }  
}};