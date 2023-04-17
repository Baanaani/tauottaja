const { useQueue } = require('discord-player');

module.exports = {
    name : 'resume',
    description : 'Takaisin musiikin pariin.',
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
                content: " :x: | Ei musiikkia tauolla!",
                ephemeral: true,
            });

        if (!queue.node.isPaused() )
            return interaction.editReply({
                content: " :x: | Ei palautettavaa musiikkia!",
                ephemeral: true,
            });

        const paused = queue.node.setPaused(false);
            return await interaction.editReply(
            paused ? " ▶ | Palautettu !" : ":x: |  Palautus epäonnistui",
            );
    },
};