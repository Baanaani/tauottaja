const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { QueryType,
        useMasterPlayer, useQueue, useTimeline } = require('discord-player');

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

        execute: async function (interaction) {

                const channel = interaction.member.voice.channel;
                if (!channel)
                    return interaction.reply({
                        content: " :x: |  Sinun pitää olla äänikanavalla!",
                        ephemeral: true,
                    });

                if (interaction.guild.members.me.voice.channel &&
                    interaction.member.voice.channel.id !==
                    interaction.guild.members.me.voice.channel.id)
                    return interaction.reply({
                        content: " ❌ | Sinun pitää olla botin kanssa samalla äänikanavalla.",
                        ephemeral: true,
                    });

                const player = useMasterPlayer();
                const queue = useQueue(interaction.guild.id);
                const query = interaction.options.getString('biisi', true);
                const timestamp = useTimeline(interaction.guild.id);
                console.log(`biisi: **${query}**`)

                const result = await player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                });

                if (!result.hasTracks()) { //Check if we found results for this query
                    return await interaction.reply({
                        content: ` ❌ | Hakutuloksia ei löytynyt hakusanalle: ${query}`,
                        ephemeral: true,
                    });
                }

            try {
                if (!queue || !queue.node.isPlaying()) {
                    interaction.reply({content: `Biisiä ladataan.`, ephemeral: true});
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
                    queue.addTrack(result.playlist ? result.tracks : result.tracks[0])
                }
            } catch (error) {
                console.log(error)
            }
        }
    }