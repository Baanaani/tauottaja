const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { QueryType,
        useMasterPlayer, useQueue, usePlayer, useTimeline } = require('discord-player');

module.exports = {
    name: 'nowplaying',
    description: 'Play a song of your choice!',
    voiceChannel: true,

    async execute(message) {
        try {
            const channel = message.member.voice.channel;
            if (!channel)
                return message.editReply({
                    content: " :x: |  Sinun pitää olla äänikanavalla!",
                    ephemeral: true,
                });

            if (message.guild.members.me.voice.channel &&
                message.member.voice.channel.id !==
                message.guild.members.me.voice.channel.id)
                return message.editReply({
                    content: " ❌ | Sinun pitää olla botin kanssa samalla äänikanavalla.",
                    ephemeral: true,
                });

            const queue = useQueue(message.guild.id);
            const progress = queue.node.createProgressBar();
            const timestamp = queue.node.getTimestamp();
            const track = queue.currentTrack;
            const timeline = useTimeline(message.guildId);
            /*
            //interaction.reply(`Current progress : (${timestamp.current.label} / ${timestamp.total.label}) : ${timestamp.progress}%`)
            setInterval(() => {
                seekBar.value = music.currentTime;
                currentTime.innerHTML = formatTime(music.currentTime);
            }, 500)
            */

            const toistaa = new EmbedBuilder();

            toistaa
                .setColor("Random")
                .setTitle("🎶 | Nyt toistaa: ")
                //.setDescription(`**${track.author} - [${track.title}](${track.url})**`)
                .setThumbnail(track.thumbnail)
                .setDescription(`[${track.title}](${track.uri}) - \n\n\`${progress}\``)
                .addFields({
                    name: '\u200b',
                    value: `\`${timestamp.current.label} / ${timestamp.total.label}\``,
                })
                .addFields([
                    {name: "Kesto", value: `${track?.duration ? track.duration : "Live"}`, inline: true},
                    //{name: '\u200B', value: '\u200B'},
                    {name: "Artisti", value: track.author, inline: true},
                    {name: "Kappale", value: `**[${track.title}](${track.url})**`, inline: false},
                    //{name: '\200', value: progress.replace(/ 0:00/g, 'LIVE') },
                    {name: "Edistyminen", value: `[${progress}](${timeline.timestamp.progress}%)`},
                    // value: (${timestamp.current.label} - ${timestamp.total.label})(${timeline.timestamp.progress}) (${timeline.timestamp.progress}%) },
                ])
                .setTimestamp()


            const row1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId("back").setEmoji(" ⏮ ").setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId("pause").setEmoji(" ⏸ ").setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId("resume").setEmoji(" ▶ ").setStyle(ButtonStyle.Secondary).setDisabled(true),
                    new ButtonBuilder().setCustomId("shuffle").setEmoji(" 🔀 ").setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId("skip").setEmoji(" ⏭ ").setStyle(ButtonStyle.Primary)
                );
            /*
            const message = await interaction.textChannel.send({
                embeds: [toistaa],
                components: [row1],
            });
            dispatcher.nowPlayingMessage = message; */
                return message.channel.send({embeds: [toistaa], components: [row1],});

        } catch (error) {
            console.log(error)
        }
    }
}