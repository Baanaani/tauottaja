const {useQueue} = require("discord-player");

module.exports = {
    name : 'pause',
    description : 'Musa tauolle, kiitos!',
    voiceChannel : true,

    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel)
            return interaction.editReply({
                content: " :x: |  Sinun pitää olla äänikanavalla!",
                ephemeral: true,
            });

        if (interaction.guild.members.me.voice.channel &&
            interaction.member.voice.channel.id !==
            interaction.guild.members.me.voice.channel.id)
            return interaction.editReply({
                content: " ❌ | Sinun pitää olla botin kanssa samalla äänikanavalla.",
                ephemeral: true,
            });

        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying())
            return interaction.editReply({
                content: " :x: | Ei löytynyt tauolle laitettavaa musiikkia!",
                ephemeral: true,
            });

        const paused = queue.node.setPaused(true);

        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();

        playembed.addFields([
            {Name: 'Nyt', value: timestamp.progress,},
            {Name: 'Edistyminen', value: progress, },
        ])
        return await interaction.editReply(
            paused ? " ⏸ | Tauolla!" : ":x: | Tauko epäonnistui "
        );
    }
}