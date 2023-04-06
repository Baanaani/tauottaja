const { useQueue } = require('discord-player')

//kun käskyä ollaan kirjoittamassa tekstikanavalle niin näyttää tämän käskyn valmiina vaihtoehtona
module.exports = {
    name : 'queue',
    description : 'näyttää jonon!',
    voiceChannel : true,

    async execute(interaction) {
        try {
            //tarkistaa onko ketää äänikanavalla
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            //tulostaa viestin jos botti ei ole soittamassa biisiä
            const queue = useQueue(interaction.guildId);
            if (!queue) { return interaction.reply(`Ei biisejä soitossa`) }
            const formatTracks = queue.tracks.toArray();

            const chunkSize = 20;
            //const pages = Math.ceil(formatTracks.length / chunkSize);

            //jos jonossa ei ole mitään niin tulostaa viestin
            if (formatTracks.length === 0) {
                return interaction.reply({ content: `Ei kappaleita jonossa`, ephemeral: true, });
            }

            if (formatTracks.length <= chunkSize) {
                const tracks = formatTracks.map(
                    (track, idx) => `**${idx + 1})** (${track.title})`);
                //näyttää biisit consolissa
                console.log(`Biisit: ${tracks}`);
                //jos listan voi näyttää niin tulostaa biisit
                await interaction.reply({content: `Biisilista: ${tracks}`, fetchReply: true});
            } else {
                //jos soittolistalla on liika kappaleita niin tulostaa alla olevan viestin
                await interaction.reply({content: `Soittolistalla on: ${formatTracks.length} kappaletta, joten sisältöä ei voi näyttää`, fetchReply: true});
            }
        //kirjaa virheet consoliin
        } catch (error) {
            console.log(error) }
    }}