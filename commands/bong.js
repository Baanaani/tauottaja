module.exports = {
    name: 'bong',
    description: 'Vastaa Pong!',
    usage: '', //OPTIONAL (for the help cmd)

    async execute(interaction) {
        await interaction.reply('Pong!')
    },
};


