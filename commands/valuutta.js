const { request } = require('undici');

module.exports = {
    name: 'valuutta',
    description: 'Valuuttamuunnin',
    options: [
        {
            name: 'lähtövaluutta',
            description: 'Mistä valuutasta muunnetaan?',
            type: 3,
            required: true
        },
        {
            name: 'kohdevaluutta',
            description: 'Mihin valuuttaan muunnetaan?',
            type: 3,
            required: true
        },
        {
            name: 'summa',
            description: 'Muunnettavan valuutan määrä kokonaislukuna',
            type: 4,
            required: true
        }
    ],

    execute: async function (interaction) {

        const startCurrency = interaction.options.getString('lähtövaluutta', true);
        const targetCurrency = interaction.options.getString('kohdevaluutta', true);
        const amount = interaction.options.getInteger('summa', true);

        await interaction.deferReply();

        const curResult = await request('https://open.er-api.com/v6/latest/eur');
        const { rates } = await curResult.body.json();



        if (!rates.length) {
            return interaction.editReply(`No results found for **${startCurrency}**.`);
        }

        return interaction.editReply({ rates: [{ key: rates, value: rates }] });



        //interaction.editReply({files: [file]});

    }
}