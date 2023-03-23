const { useQueue } = require('discord-player')

module.exports = {
    name : 'shuffle',
    description : 'Sekoita soittolista, kiitos!',
    voiceChannel : true,

    async execute(interaction) {
        try{
            const queue = useQueue(interaction.guildId);

            if (!queue || !queue.isPlaying()) {
                return interaction.reply({ content: "Ei sekoitettavaa.", ephemeral: true })
            }

            await queue.tracks.shuffle();
            interaction.reply(`Soittolista on sekoitettu.`)
        }catch (error) {
            console.log(error)
        }
    }
}