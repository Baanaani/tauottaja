const { useQueue } = require('discord-player');

module.exports = {
    name : 'pause',
    description : 'Musa tauolle, kiitos!',
    voiceChannel : true,

    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.isPlaying()) {
                return interaction.reply({ content: "Ei löytynyt tauolle laitettavaa musaa.", ephemeral: true })
            }

            const paused = queue.node.setPaused(true);
            return interaction.reply({ content: paused ? 'Musa on tauolla. Jatka /resume-komennolla' : "Pieleen meni musan taolle laitto!" })
        }catch (error) {
            console.log(error)
        }
    }
}