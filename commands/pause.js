const { useQueue } = require('discord-player');

module.exports = {
    name : 'pause',
    description : 'Musa tauolle, kiitos!',
    voiceChannel : true,

    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            if (!channel)
                return interaction.reply({
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
                return interaction.reply({
                    content: " :x: | Ei löytynyt tauolle laitettavaa musaa.",
                    ephemeral: true
                });


            const paused = queue.node.setPaused(true);
            return interaction.reply({ content: paused ? 'Musa on tauolla. Jatka /resume-komennolla' : "Pieleen meni musan taolle laitto!" })
        }catch (error) {
            console.log(error)
        }
    }
}