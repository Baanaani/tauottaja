const { useQueue } = require('discord-player');

module.exports = {
    name : 'resume',
    description : 'Takaisin musiikin pariin.',
    voiceChannel : true,

    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id)
            if (!queue.node.isPaused() ){
                return interaction.reply({ content: "Ei löytynyt palautettavaa musaa.", ephemeral: true })
            }

            const paused = queue.node.setPaused(false);
            return interaction.reply({ content: paused ? 'Musiikin toistoa jatkettu.' : "Pieleen meni musan palautus tauolta!" })
        }catch (error) {
            console.log(error)
        }
    }
}