module.exports = {
    name: 'ping',
    description: 'Returns the round trip and heartbeat',

    async execute(interaction) {
        const msg = await interaction.reply({ content: `Ping?`, fetchReply: true })
        if (msg) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp
            const ping = Math.round(interaction.client.ws.ping)
            return interaction.editReply(
                `The round trip took **${diff}ms** and the heartbeat being **${ping}ms**`
            )
        }

        return interaction.editReply('Failed to retrieve ping...')
    }
}