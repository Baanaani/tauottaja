const {QueryType} = require('discord-player');

module.exports = {
    name: 'play',
    description: 'Play a song in your channel!',
    type: 1,
    utilization: '{prefix}play [song name/URL]',

    async execute(client, message, command, interaction) {
        try {
            const res = await client.player.search(command.join(' '), {
                requestedBy: message.member,
                searchEngine: QueryType.AUTO
            });

            await message.deferReply();

            if (!res || !res.tracks.length)
                return void message.followUp({content: 'No results were found!'});

            await client.player.play(message.guild, {
                metadata: {
                    metadata: message.channel,
                },
                selfDeaf: true,
                volume: 50,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            });
            try {
                if (!client.player.connection) await client.player.connect(message.member.voice.channel);
            } catch {
                void client.player(message.guildId);
                return void message.followUp({
                    content: 'Could not join your voice channel!',
                });
            }
            await message.followUp({
                content: `⏱ | Loading your ${res.playlist ? 'playlist' : 'track'}...`,
            });
            await res.playlist ? client.player.addTrack(res.tracks) : client.player.addTrack(res.tracks[0]);
            if (!client.player.playing) await client.player.play();
        }catch (error) {
            console.log(error);
            await message.followUp({
                content: 'There was an error trying to execute that command: ' + error.message,
            });
                    try {

        const tracks = interaction.options.getInteger("value")
        const queue = interaction.client.player.nodes.get(interaction.guild)

        if (!queue) {
            return interaction.reply({ content: "There is no queue!" })
        }

        const trackIndex = tracks - 1;

        await queue.node.jump(trackIndex)

        return interaction.reply({ content: "Jumped successfully successfully!" })
    }catch (error) {
        console.log(error)
    }
    try {

        const tracks = interaction.options.getInteger("value")
        const queue = interaction.client.player.nodes.get(interaction.guild)

        if (!queue) {
            return interaction.reply({ content: "There is no queue!" })
        }

        const trackIndex = tracks - 1;

        await queue.node.jump(trackIndex)

        return interaction.reply({ content: "Jumped successfully!" })
    }catch (error) { console.log(error) }
}}};
