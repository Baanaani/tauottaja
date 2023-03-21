const { useQueue } = require('discord-player')

module.exports = {
    name : 'queue',
    description : 'näyttää jonon!',
    voiceChannel : true,

    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            const queue = useQueue(interaction.guildId);

            if (!queue) { return interaction.reply(`Ei biisejä soitossa`) }
            const formatTracks = queue.tracks.toArray();

            const chunkSize = 20;
            //const pages = Math.ceil(formatTracks.length / chunkSize);

            if (formatTracks.length === 0) {
                return interaction.reply({ content: `Ei kappaleita jonossa`, ephemeral: true, });
            }

            if (formatTracks.length <= chunkSize) {
                const tracks = formatTracks.map(
                    (track, idx) => `**${idx + 1})** (${track.title})\n`);
                console.log(`Biisit: ${tracks}`);
                await interaction.reply({content: `Biisilista: ${tracks}`, fetchReply: true});
            } else {
                for (let i = 0; i < chunkSize; i++) {
                    const tracks = formatTracks.map(
                        (track, idx) => `**${idx + 1})** (${track.title})\n`);
                    console.log(`Biisit: ${tracks}`);
                    await interaction.reply({content: `Biisilista: ${tracks}`, fetchReply: true});
                }
                await interaction.reply({content: `Soittolistalla on vielä ${formatTracks.length - chunkSize} 
                kappaletta, joiden sisältöä ei voida näyttää`, fetchReply: true});
            }

        } catch (error) {
            console.log(error) }
    }}

//https://youtube.com/playlist?list=PLliiMqsVIF-OPMfR4mlwvdVLMp9ko0QKY
//https://youtube.com/playlist?list=PL4QNnZJr8sRM25rNbVyQrEjRZieayr22z
//https://youtube.com/playlist?list=PLA57XoZpnzIuRRnPuh4huTIYtkL4L-F7K